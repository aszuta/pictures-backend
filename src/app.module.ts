import { Module } from '@nestjs/common';
import { KnexModule } from 'nest-knexjs';
import { PicturesModule } from './pictures/pictures.module';

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: 'mysql2',
        connection: {
          host: 'localhost',
          user: 'root',
          password: 'CEB!ula2',
          database: 'picturesapp',
          port: 3306,
        },
      },
    }),
    PicturesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
