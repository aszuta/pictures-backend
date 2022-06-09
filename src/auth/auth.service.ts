import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/user/dto/user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}
    
    async getAccessToken(id: number): Promise<string> {
        return this.jwtService.sign({ sub: id });
    }
    
    async getRefreshToken(id: number): Promise<string> {
        const refreshToken = uuidv4();
        await this.userService.setCurrentRefreshToken(refreshToken, id);
        return refreshToken;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if(user && bcrypt.compare(user.password, password)){
            delete user.password;
            return user;
        }
        return null;
    }

    async login(loginUserDto: UserLoginDto): Promise<Record<string, any>> {
        const user = await this.userService.findOne(loginUserDto.email);
        const accessToken = await this.getAccessToken(user.id);
        const refreshToken = await this.getRefreshToken(user.id);
        return {
            accessToken,
            refreshToken
        }
    }
}
