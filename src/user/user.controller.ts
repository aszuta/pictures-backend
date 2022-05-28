import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from 'src/user/dto/user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        ){}
    
    @Post('register')
    create(@Body() createUserDto: UserDto): Promise<any> {
        return this.userService.create(createUserDto);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req): Promise<any>{
        return await this.userService.findById(req.user.id);
    }

}