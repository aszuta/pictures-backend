import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'dto/create-user.dto';
import { LoginUserDto } from 'dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('api/user/')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
        ){}
    
    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    //@UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto){
        //console.log(loginUserDto);
        return this.authService.login(loginUserDto);
    }

    @Get('/:email')
    findOne(@Param('email') email: string) {
        const user = this.userService.findOne(email);
        return user;
    }
}
