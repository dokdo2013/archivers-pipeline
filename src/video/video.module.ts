import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { YudarlinnSegment } from 'src/recorder/entities/yudarlinn-segment.entity';
import { YudarlinnStream } from 'src/recorder/entities/yudarlinn-stream.entity';

@Module({
  imports: [SequelizeModule.forFeature([YudarlinnSegment, YudarlinnStream])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
