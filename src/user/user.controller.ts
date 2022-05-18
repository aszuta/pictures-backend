import { Body, Controller, Get, Post, UseGuards, Req, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from 'dto/create-user.dto';
import { LoginUserDto } from 'dto/login-user.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Response } from 'express';
import { multerOptions } from 'src/config/multerOptions';

@Controller('api/user/')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
        ){}
    
    @Post('register')
    create(@Body() createUserDto: CreateUserDto): Promise<any> {
        return this.userService.create(createUserDto);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response): Promise<void> {
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
    @Post('upload')
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    async uploadFile(@UploadedFile() file, @Req() req): Promise<void> {
        return this.userService.uploadFile(req.file);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req): Promise<any>{
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