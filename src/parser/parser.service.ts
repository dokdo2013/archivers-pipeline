import { Injectable } from '@nestjs/common';
import { getStream } from 'twitch-m3u8';
import { Parser } from 'm3u8-parser';
import axios from 'axios';

@Injectable()
export class ParserService {
  constructor() {}

  async getM3u8(user_id: string): Promise<any> {
    // const user_id = 'arahashitabi_stellive';
    const stream_data: any = await getStream(user_id).then((stream) => {
      // console.log(stream);
      return stream;
    });

    return stream_data;
  }

  async getM3u8Data(url: string): Promise<any> {
    const m3u8_data = await axios
      .get(url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error('m3u8 데이터를 가져오는데 실패했습니다.');
      });

    return m3u8_data;
  }

  async getParser(data: any): Promise<any> {
    const parser = new Parser();
    parser.push(data);
    parser.end();
    return parser;
  }

  async getTsUrls(data: any): Promise<any> {
    const parser = await this.getParser(data);
    const ts_segments = parser.manifest.segments;
    const ts_urls = ts_segments.map((segment) => {
      return segment.uri;
    });

    return ts_urls;
  }
}
