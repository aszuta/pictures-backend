// eslint-disable-next-line @typescript-eslint/no-var-requires
//require('dotenv').config({ path: `${__dirname}/../.env` });
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import Config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  // app.setGlobalPrefix('/api');
  await app.listen(Config.port, Config.host);
}
bootstrap();
