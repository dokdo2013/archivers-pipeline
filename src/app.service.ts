import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async init() {
    // check env variables
    const streamId = this.configService.get<string>('STREAM_ID');
    const m3u8Url = this.configService.get<string>('M3U8_URL');

    if (!streamId) {
      throw new Error('STREAM_ID env variable is not set');
    } else if (!m3u8Url) {
      throw new Error('M3U8_URL env variable is not set');
    }

    return { streamId, m3u8Url };
  }
}
