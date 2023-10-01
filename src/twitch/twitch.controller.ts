import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('twitch')
@Controller('twitch')
export class TwitchController {
  constructor() {}

  @Get('eventsub')
  async getTwitch() {
    return 'Hello World!';
  }
}
