import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParserService } from './parser.service';
import axios from 'axios';

@ApiTags('parser')
@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post('')
  async postClipper() {
    // m3u8 주소 획득
    const m3u8 = await this.parserService.getM3u8('arahashitabi_stellive');
    const m3u8_url = m3u8[0] ? m3u8[0].url : '';

    // m3u8 내부 데이터 획득
    const m3u8_data = await axios
      .get(m3u8_url)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        throw new Error('m3u8 데이터를 가져오는데 실패했습니다.');
      });

    // m3u8 내부 데이터 파싱 (ts 파일 주소 획득)
    const parser = await this.parserService.getParser(m3u8_data);
    // const ts_segments = parser.manifest.segments;
    // const ts_urls = ts_segments.map((segment) => {
    //   return segment.uri;
    // });

    // ts 파일 결합해서 30초짜리 클립 생성

    // 클립 업로드

    // 클립 주소 반환

    return parser;
    // return ts_urls;
  }

  @Get('m3u8')
  @ApiQuery({ name: 'user_id', required: true })
  async getM3u8(@Query('user_id') user_id: string) {
    return await this.parserService.getM3u8(user_id);
  }
}
