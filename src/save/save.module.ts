import { Module, forwardRef } from '@nestjs/common';
import { SaveService } from './save.service';
import { SaveController } from './save.controller';
import { RedisModule } from 'nestjs-redis';
import { SaveRepository } from './save.repository';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  providers: [SaveService, SaveRepository],
  controllers: [SaveController]
})
export class SaveModule {}
