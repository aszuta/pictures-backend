import { Module, forwardRef } from '@nestjs/common';
import { SaveService } from './save.service';
import { SaveController } from './save.controller';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  providers: [SaveService],
  controllers: [SaveController]
})
export class SaveModule {}
