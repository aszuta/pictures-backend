import { forwardRef, Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  providers: [PictureService],
  controllers: [PictureController]
})
export class PictureModule {}
