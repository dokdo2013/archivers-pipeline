import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { YudarlinnSegment } from 'src/recorder/entities/yudarlinn-segment.entity';
import { YudarlinnStream } from 'src/recorder/entities/yudarlinn-stream.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel(YudarlinnStream)
    private readonly yudarlinnStreamModel: typeof YudarlinnStream,
    @InjectModel(YudarlinnSegment)
    private readonly yudarlinnSegmentModel: typeof YudarlinnSegment,
    private readonly sequelize: Sequelize,
  ) {
    this.sequelize.addModels([YudarlinnStream, YudarlinnSegment]);
  }

  async getStream(streamId: string) {
    const res = await this.yudarlinnStreamModel.findOne({
      where: {
        streamId,
      },
    });

    return res;
  }

  async getSegments(streamId: string) {
    const res = await this.yudarlinnSegmentModel.findAll({
      where: {
        streamId,
      },
      order: [['segmentNumber', 'ASC']],
    });

    const segmentLinks = res.map((segment) => segment.link);

    return segmentLinks;
  }

  generateM3u8(segmentLinks: string[], segmentSeconds: number) {
    let m3u8 = '#EXTM3U' + '\n';
    m3u8 += '#EXT-X-VERSION:3' + '\n';
    m3u8 += '#EXT-X-TARGETDURATION:2\n';
    m3u8 += '#EXT-X-MEDIA-SEQUENCE:0' + '\n';

    for (let i = 0; i < segmentLinks.length; i++) {
      m3u8 += '#EXTINF:' + segmentSeconds + '.000,' + '\n';
      m3u8 += segmentLinks[i] + '\n';
    }

    m3u8 += '#EXT-X-ENDLIST';

    return m3u8;
  }
}
