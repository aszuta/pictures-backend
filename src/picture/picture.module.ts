import { forwardRef, Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { RedisModule } from 'src/redis/redis.module';
import { PictureRepository } from './picture.repository';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  providers: [PictureService, PictureRepository],
  controllers: [PictureController]
})
export class PictureModule {}
