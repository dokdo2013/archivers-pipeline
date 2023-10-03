import { Module } from '@nestjs/common';
import { RecorderService } from './recorder.service';
import { ParserModule } from 'src/parser/parser.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Segment } from './entities/segment.entity';
import { Stream } from './entities/stream.entity';

@Module({
  imports: [ParserModule, SequelizeModule.forFeature([Segment, Stream])],
  providers: [RecorderService],
})
export class RecorderModule {}
