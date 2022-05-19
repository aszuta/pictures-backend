// eslint-disable-next-line @typescript-eslint/no-var-requires
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import Config from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..' , 'public'), {
    prefix: '/public/'
  });
  app.enableCors();
  app.use(cookieParser());
  // app.setGlobalPrefix('/api');
  await app.listen(Config.port, Config.host, () => {
    console.log(`App listening on port ${Config.port}`);
  });
}
bootstrap();
