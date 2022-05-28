import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from 'src/user/dto/user.dto';
import { uid } from 'rand-token';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}
    
    async getAccessToken(id: number): Promise<any> {
        return this.jwtService.sign({ sub: id });
    }
    
    async getRefreshToken(id: number): Promise<string> {
        const refreshToken = uid(16);
        await this.userService.setCurrentRefreshToken(refreshToken, id);
        return refreshToken;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if(user && bcrypt.compare(user.password, password)){
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginUserDto: UserLoginDto): Promise<any> {
        const user = await this.userService.findOne(loginUserDto.email);
        const accessToken = await this.getAccessToken(user.id);
        const refreshToken = await this.getRefreshToken(user.id);
        return {
            accessToken,
            refreshToken
        }
    }
}
