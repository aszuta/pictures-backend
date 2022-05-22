import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PictureModule } from './picture/picture.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import Config from './config';
import { join } from 'path';
import { CommentModule } from './comment/comment.module';
import { VoteModule } from './vote/vote.module';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: Config.database,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../public'),
      serveRoot: '/public/'
    }),
    RedisModule,
    PictureModule,
    UserModule,
    AuthModule,
    CommentModule,
    VoteModule,
  ],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
