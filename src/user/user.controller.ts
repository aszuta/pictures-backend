import { Body, Controller, Get, Param, Post, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'dto/create-user.dto';
import { LoginUserDto } from 'dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtRefreshGuard } from 'src/auth/jwt-refresh.guard'
import { Response } from 'express';

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
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response){
        const data = await this.authService.login(loginUserDto);
        res.cookie('authcookie', data.accessToken, {
            // httpOnly: true,
            expires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.cookie('refreshtoken', data.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req){
        return req.user
    }

    @Get(':email')
    findOne(@Param('email') email: string) {
        const user = this.userService.findOne(email);
        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() req, @Res() res){
        const accessToken = this.authService.getAccessToken(req.user.id);
        const refreshToken = this.authService.getRefreshToken(req.user.id);
        res.cookie('auth-cookie', refreshToken, {
            httpOnly: true
        });
        return accessToken;
    }
}