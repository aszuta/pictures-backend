import { Body, Controller, Get, Param, Request, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'dto/create-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService){}
    
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@Request() req){
        return req.user;
    }

    @Get('/:email')
    findOne(@Param('email') email: string) {
        return this.userService.findOne(email);
    }
}
