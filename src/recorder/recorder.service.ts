import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { YudarlinnStream } from './entities/yudarlinn-stream.entity';
import { YudarlinnSegment } from './entities/yudarlinn-segment.entity';
import { Sequelize } from 'sequelize-typescript';
import { ParserService } from 'src/parser/parser.service';
import { ISegment } from 'src/parser/parser.interface';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecorderService {
  constructor(
    @InjectModel(YudarlinnSegment)
    private readonly yudarlinnSegmentModel: typeof YudarlinnSegment,
    private readonly parserService: ParserService,
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
  ) {
    this.sequelize.addModels([YudarlinnStream, YudarlinnSegment]);
  }

  async process(streamId: string, m3u8Url: string) {
    // 전역변수
    let segmentCount = 0;
    let failureCount = 0;

    // 2초 간격이니 30초동안 호출이 안되면 종료
    while (failureCount < 15) {
      try {
        // 1. get m3u8 data
        const m3u8Data = await this.parserService.getM3u8Data(m3u8Url);

        // 2. get ts segments
        const tsSegments = await this.parserService.getTsSegments(m3u8Data);

        // [escape condition] if there are no ts urls, break
        if (tsSegments.length === 0) {
          break;
        }

        tsSegments.forEach(async (segment) => {
          // 3. create kubernetes job to download and upload ts file
          await this.createJob(segment, streamId);

          // 4. log
          Logger.log(`segment ${segmentCount++} requested`);
        });

        // 5. sleep for 2 seconds (using promise)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        failureCount = 0;
      } catch (err) {
        console.error(err);
        failureCount++;
      }
    }
  }

  /**
   * Create kubernetes job
   * @param segment m3u8 segment
   * @param streamId 생방송 ID
   */
  async createJob(segment: ISegment, streamId: string) {
    const randomString = Math.random().toString(36).substring(7);

    const config = {
      s3Url: `https://${this.configService.get<string>(
        'CLOUDFLARE_ACCOUNT_ID',
      )}.r2.cloudflarestorage.com`,
      s3AccessKeyId: this.configService.get<string>('CLOUDFLARE_ACCESS_KEY_ID'),
      s3SecretAccessKey: this.configService.get<string>(
        'CLOUDFLARE_SECRET_ACCESS_KEY',
      ),
      bucketName: 'yudarlinn-assets',
    };

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.BatchV1Api);

    const jobManifest: k8s.V1Job = {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: {
        name: `yudarlinn-processor-${streamId}-${randomString}`,
      },
      spec: {
        template: {
          spec: {
            containers: [
              {
                name: 'processor',
                image: 'hyeonwoo5342/yudarlinn-processor:latest',
                env: [
                  {
                    name: 'STREAM_ID',
                    value: streamId,
                  },
                  {
                    name: 'DATE',
                    value: segment.dateTimeString,
                  },
                  {
                    name: 'SEGMENT_URI',
                    value: segment.uri,
                  },
                  {
                    name: 'SEGMENT_DURATION',
                    value: segment.duration.toString(),
                  },
                  {
                    name: 'S3_URL',
                    value: config.s3Url,
                  },
                  {
                    name: 'S3_ACCESS_KEY_ID',
                    value: config.s3AccessKeyId,
                  },
                  {
                    name: 'S3_SECRET_ACCESS_KEY',
                    value: config.s3SecretAccessKey,
                  },
                  {
                    name: 'S3_BUCKET_NAME',
                    value: config.bucketName,
                  },
                ],
              },
            ],
            restartPolicy: 'OnFailure',
          },
        },
        ttlSecondsAfterFinished: 10,
        backoffLimit: 5,
      },
    };

    await k8sApi.createNamespacedJob('leaven', jobManifest);
  }

  /**
   * Create segment
   * @param streamId 생방송 ID
   * @param segmentId 세그먼트 ID
   * @param link 세그먼트 링크
   * @returns {Promise<YudarlinnSegment>} YudarlinnSegment
   */
  async createSegment(
    streamId: string,
    segmentId: string,
    duration: number,
    segmentNumber: number,
    link: string,
  ) {
    const res = await this.yudarlinnSegmentModel.create({
      streamId,
      segmentId,
      segmentLength: duration,
      segmentNumber,
      link,
    });

    return res;
  }
}
