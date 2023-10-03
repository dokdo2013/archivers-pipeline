import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ParserService } from 'src/parser/parser.service';
import { ISegment } from 'src/parser/parser.interface';
import * as k8s from '@kubernetes/client-node';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Stream } from './entities/stream.entity';
import { Streamer } from './entities/streamer.entity';
import axios from 'axios';

@Injectable()
export class RecorderService {
  constructor(
    @InjectModel(Stream)
    private readonly StreamModel: typeof Stream,
    @InjectModel(Streamer)
    private readonly StreamerModel: typeof Streamer,
    private readonly parserService: ParserService,
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {
    this.sequelize.addModels([Stream, Streamer]);
  }

  async process(streamId: string, m3u8Url: string) {
    // 전역변수
    let failureCount = 0;

    // redis (set 자료구조)
    const redisKey = `archivers:recorder:${streamId}`;
    const segmentCountKey = `archivers:recorder:${streamId}:segmentCount`;
    let segmentCount = parseInt(
      (await this.redisClient.get(segmentCountKey)) || '-1',
    );
    if (segmentCount === -1) {
      await this.redisClient.set(segmentCountKey, '0');
    }

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
          // [escape condition] if segment is already in set, continue
          const hasSegment = await this.redisClient.sismember(
            redisKey,
            segment.uri,
          );
          if (hasSegment) {
            return;
          }

          // 3. create kubernetes job to download and upload ts file
          await this.createJob(segment, streamId);

          // 4. log and increase segment count
          Logger.log(`segment ${segmentCount++} requested`);
          await this.redisClient.set(segmentCountKey, segmentCount.toString());

          // 5. add segment to set
          await this.redisClient.sadd(redisKey, segment.uri);
        });

        // 6. sleep for 2 seconds (using promise)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 7. when the segment count is 20, then save thumbnail image (when fail, retry 10 times)
        if (segmentCount % 20 === 0 && segmentCount <= 200) {
          const thumbnailKey = `archivers:recorder:${streamId}:thumbnail`;
          const hasThumbnail = await this.redisClient.get(thumbnailKey);

          if (!hasThumbnail) {
            try {
              await this.saveThumbnail(streamId);
              await this.redisClient.set(thumbnailKey, 'true');
              Logger.log('thumbnail saved');
            } catch (err) {
              console.error(err);
            }
          } else {
            Logger.log('thumbnail already saved');
          }
        }

        // 8. set failureCount to 0
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
      s3Region: 'auto',
      s3Url: `https://${this.configService.get<string>(
        'CLOUDFLARE_ACCOUNT_ID',
      )}.r2.cloudflarestorage.com`,
      s3AccessKeyId: this.configService.get<string>('CLOUDFLARE_ACCESS_KEY_ID'),
      s3SecretAccessKey: this.configService.get<string>(
        'CLOUDFLARE_SECRET_ACCESS_KEY',
      ),
      bucketName: 'archivers-assets',
      cdnBaseUrl: 'https://assets.archivers.app',
    };

    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(k8s.BatchV1Api);

    const jobManifest: k8s.V1Job = {
      apiVersion: 'batch/v1',
      kind: 'Job',
      metadata: {
        name: `archivers-processor-${streamId}-${randomString}`,
      },
      spec: {
        template: {
          spec: {
            nodeSelector: {
              'vke.vultr.com/node-pool': 'archivers-sub',
            },
            containers: [
              {
                name: 'processor',
                image: 'hyeonwoo5342/archivers-processor:latest',
                env: [
                  {
                    name: 'STREAM_ID',
                    value: streamId,
                  },
                  {
                    name: 'DATE',
                    value: dayjs(segment.dateTimeString).format(
                      'YYYY-MM-DDTHH:mm:ssZ',
                    ),
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
                    name: 'S3_REGION',
                    value: config.s3Region,
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
                  {
                    name: 'CDN_BASE_URL',
                    value: config.cdnBaseUrl,
                  },
                ],
                envFrom: [
                  {
                    secretRef: {
                      name: 'archivers-secret',
                    },
                  },
                ],
                resources: {
                  requests: {
                    cpu: '150m',
                    memory: '150Mi',
                  },
                  limits: {
                    cpu: '150m',
                    memory: '150Mi',
                  },
                },
              },
            ],
            imagePullSecrets: [
              {
                name: 'dockerhub-secret',
              },
            ],
            restartPolicy: 'OnFailure',
          },
        },
        ttlSecondsAfterFinished: 10,
        backoffLimit: 5,
      },
    };

    await k8sApi.createNamespacedJob('archivers', jobManifest);
  }

  async saveThumbnail(streamId: string) {
    // get user name from streamId
    const stream = await this.StreamModel.findOne({
      where: {
        streamId,
      },
    });
    const streamerId = stream.streamerId;
    const streamer = await this.StreamerModel.findOne({
      where: {
        id: streamerId,
      },
    });

    // make twitch thumbnail url
    const twitchThumbnailUrl = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${streamer.twitchName}.jpg`;
    const fileName = `archivers-thumb-${streamId}`;

    // upload thumbnail to cloudflare images
    await this.uploadToCloudflareImages(twitchThumbnailUrl, fileName);

    const thumbnailUrl = `https://archivers.app/cdn-cgi/imagedelivery/lR-z0ff8FVe1ydEi9nc-5Q/${fileName}/public`;

    // save to database
    await this.StreamModel.update(
      {
        thumbnailUrl,
      },
      {
        where: {
          streamId,
        },
      },
    );

    return {
      url: thumbnailUrl,
    };
  }

  private async uploadToCloudflareImages(imageUrl: string, fileName: string) {
    // curl --request POST \
    // --url https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/images/v1 \
    // --header 'Authorization: Bearer <API_TOKEN>' \
    // --form 'url=https://[user:password@]example.com/<PATH_TO_IMAGE>' \
    // --form 'metadata={"key":"value"}' \
    // --form 'requireSignedURLs=false'

    const account = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const token = this.configService.get<string>('CLOUDFLARE_IMAGES_API_TOKEN');

    const url = `https://api.cloudflare.com/client/v4/accounts/${account}/images/v1`;

    const formData = new FormData();
    formData.append('url', imageUrl);
    formData.append('requireSignedURLs', 'false');
    formData.append('id', fileName);

    await axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        console.error(err);
      });

    return true;
  }
}
