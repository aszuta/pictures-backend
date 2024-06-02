import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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

    @Get(':id')
    async getUserProfile(@Param('id', ParseIntPipe) id): Promise<Record<string, any>> {
        const profile = await this.userService.findOneById(id);
        return profile;
    }
}