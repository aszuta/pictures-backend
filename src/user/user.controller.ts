import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'dto/create-user.dto';
import { LoginUserDto } from 'dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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
        console.log(data);
        res.cookie('authcookie', data.accessToken, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.cookie('refreshtoken', data.refreshToken, {
            httpOnly: true,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req){
        const user = this.userService.findById(req.user.id);
        return user;
    }

    @Get('refresh')
    async refresh(@Req() req, @Res({ passthrough:true }) res){
        const hash = req.cookies['refreshtoken'];
        const data = await this.userService.findByRefresh(hash);
        const accessToken = await this.authService.getAccessToken(data.id);
        const refreshToken = await this.authService.getRefreshToken(data.id);
        console.log(accessToken);
        console.log(refreshToken);
        res.cookie('authcookie', accessToken, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Req() req, @Res({ passthrough:true }) res){
        console.log(req.user.id);
        await this.userService.removeRefreshToken(req.user.id);
        res.clearCookie('authcookie');
        res.clearCookie('refreshtoken');
    }
}