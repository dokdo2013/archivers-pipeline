import { Module } from '@nestjs/common';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';

@Module({
  controllers: [TwitchController],
  providers: [TwitchService],
})
export class TwitchModule {}
