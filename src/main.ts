// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: `${__dirname}/../.env` });
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Config from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(Config.port, Config.host);
}
bootstrap();
