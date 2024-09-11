import { forwardRef, Module } from '@nestjs/common';
import { PictureService } from './picture.service';
import { PictureController } from './picture.controller';
import { RedisModule } from 'src/redis/redis.module';
import { PictureRepository } from './picture.repository';
import { CommentRepository } from 'src/comment/comment.repository';
import { JwtService } from '@nestjs/jwt';
import { SaveRepository } from 'src/save/save.repository';
import { VoteRepository } from 'src/vote/vote.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [
    forwardRef(() => RedisModule)
  ],
  providers: [PictureService, PictureRepository, SaveRepository, VoteRepository, CommentRepository, UserRepository, JwtService],
  controllers: [PictureController]
})
export class PictureModule {}
