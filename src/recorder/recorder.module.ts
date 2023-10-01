import { Module } from '@nestjs/common';
import { RecorderController } from './recorder.controller';
import { RecorderService } from './recorder.service';
import { ParserModule } from 'src/parser/parser.module';
import { YudarlinnStream } from './entities/yudarlinn-stream.entity';
import { YudarlinnSegment } from './entities/yudarlinn-segment.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ParserModule,
    SequelizeModule.forFeature([YudarlinnSegment, YudarlinnStream]),
    BullModule.registerQueue({
      name: 'archivers',
    }),
  ],
  controllers: [RecorderController],
  providers: [RecorderService],
})
export class RecorderModule {}
