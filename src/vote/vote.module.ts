import { forwardRef, Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  controllers: [VoteController],
  providers: [VoteService]
})
export class VoteModule {}
