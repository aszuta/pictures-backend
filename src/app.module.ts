import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { PictureModule } from './picture/picture.module';
import { UserModule } from './user/user.module';
import Config from './config';

@Module({
  imports: [
    KnexModule.forRoot({
      config: Config.database,
    }),
    PictureModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
