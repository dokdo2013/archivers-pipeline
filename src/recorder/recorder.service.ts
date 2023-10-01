import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { YudarlinnStream } from './entities/yudarlinn-stream.entity';
import { YudarlinnSegment } from './entities/yudarlinn-segment.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RecorderService {
  constructor(
    @InjectModel(YudarlinnStream)
    private readonly yudarlinnStreamModel: typeof YudarlinnStream,
    @InjectModel(YudarlinnSegment)
    private readonly yudarlinnSegmentModel: typeof YudarlinnSegment,
    private readonly sequelize: Sequelize,
  ) {
    this.sequelize.addModels([YudarlinnStream, YudarlinnSegment]);
  }

  /**
   * Create stream
   * @param streamId 생방송 ID
   * @param title 생방송 제목
   * @param categoryId 카테고리 ID
   * @param categoryName 카테고리 이름
   * @returns {Promise<YudarlinnStream>} YudarlinnStream
   */
  async createStream(
    streamId: string,
    title: string,
    categoryId: number,
    categoryName: string,
  ) {
    const res = await this.yudarlinnStreamModel.create({
      streamId,
      title,
      categoryId,
      categoryName,
      isLive: true,
      startAt: new Date(),
    });

    return res;
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

  // async getTsSegmentLength(link: string) {
  //   let duration = 2.0;
  //   ffmpeg.ffprobe(link, (err, metadata) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }

  //     duration = metadata.format.duration;
  //     console.log(duration);
  //   });

  //   return duration;
  // }
}
