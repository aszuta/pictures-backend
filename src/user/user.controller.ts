import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        ){}
    
    @Post()
    create(@Body() createUserDto: UserDto): Promise<any> {
        return this.userService.create(createUserDto);
    }
}