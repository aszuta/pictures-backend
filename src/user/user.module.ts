import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [AuthModule],
  providers: [UserService, UserRepository],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
