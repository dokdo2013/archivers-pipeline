import { Module } from '@nestjs/common';
import { RecorderService } from './recorder.service';
import { ParserModule } from 'src/parser/parser.module';
import { YudarlinnStream } from './entities/yudarlinn-stream.entity';
import { YudarlinnSegment } from './entities/yudarlinn-segment.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ParserModule,
    SequelizeModule.forFeature([YudarlinnSegment, YudarlinnStream]),
  ],
  providers: [RecorderService],
})
export class RecorderModule {}
