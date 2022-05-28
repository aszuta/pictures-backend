import { Body, Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/user/dto/user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginUserDto: UserLoginDto, @Res({ passthrough: true }) res: Response): Promise<void> {
        const data = await this.authService.login(loginUserDto);
        res.cookie('authcookie', data.accessToken, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.cookie('refreshtoken', data.refreshToken, {
            httpOnly: true,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getUser(@Req() req): Promise<any>{
        return await this.userService.findById(req.user.id);
    }

    @Get('refresh')
    async refresh(@Req() req, @Res({ passthrough:true }) res): Promise<void> {
        const hash = req.cookies['refreshtoken'];
        const data = await this.userService.findByRefresh(hash);
        const accessToken = await this.authService.getAccessToken(data.id);
        const refreshToken = await this.authService.getRefreshToken(data.id);
        res.cookie('authcookie', accessToken, {
            expires: new Date(Date.now() + 5 * 60 * 1000),
        });
        res.cookie('refreshtoken', refreshToken, {
            httpOnly: true,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logOut(@Req() req, @Res({ passthrough:true }) res): Promise<void> {
        await this.userService.removeRefreshToken(req.user.id);
        res.clearCookie('authcookie');
        res.clearCookie('refreshtoken');
    }
}
