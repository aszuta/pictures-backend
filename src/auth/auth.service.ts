import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
        ){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if(user && bcrypt.compare(user.password, password)){
            console.log('tak');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        console.log('nie');
        return null;
    }

    async login(loginUserDto: LoginUserDto) {
        const user = await this.userService.findOne(loginUserDto.email);
        const payload = { sub: user.id };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
