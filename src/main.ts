import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RecorderService } from './recorder/recorder.service';

async function bootstrap() {
  Logger.log('Starting application...');

  const appContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });

  // check env variables
  const appService = appContext.get(AppService);
  const { streamId, m3u8Url } = await appService.init();

  // start main recording
  const recorderService = appContext.get(RecorderService);
  await recorderService.process(streamId, m3u8Url);

  process.exit(0);
}
bootstrap();
