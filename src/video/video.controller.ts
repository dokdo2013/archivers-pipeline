import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('stream/:stream_id')
  @ApiParam({
    name: 'stream_id',
    description: 'stream id',
    example: 'a1b2c3d4e5',
  })
  async getVideo(@Param('stream_id') stream_id: string, @Res() res) {
    // get stream id from request
    const stream = await this.videoService.getStream(stream_id);
    if (!stream) {
      throw new NotFoundException('해당하는 스트림이 없습니다.');
    }

    const segments = await this.videoService.getSegments(stream_id);

    // generate m3u8 file from segments
    const m3u8 = this.videoService.generateM3u8(segments, 2);

    // return m3u8 text to response
    // just return m3u8 text (don't use nestjs interceptors)
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(m3u8);
  }
}
