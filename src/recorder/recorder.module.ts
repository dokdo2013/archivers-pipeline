import { Module } from '@nestjs/common';
import { RecorderService } from './recorder.service';
import { ParserModule } from 'src/parser/parser.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Segment } from './entities/segment.entity';
import { Stream } from './entities/stream.entity';
import { Streamer } from './entities/streamer.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ParserModule,
    SequelizeModule.forFeature([Segment, Stream, Streamer]),
    BullModule.registerQueue({
      name: 'worker',
    }),
  ],
  providers: [RecorderService],
})
export class RecorderModule {}
