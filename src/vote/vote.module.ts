import { forwardRef, Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  controllers: [VoteController],
  providers: [VoteService, VoteRepository]
})
export class VoteModule {}
