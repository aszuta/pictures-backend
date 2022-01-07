import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService){}

    async validateUser(email: string, hashedPassword: string){
        const user = await this.userService.findOne(email);
        const comparePasswords = bcrypt.compare(hashedPassword, user.password);
        if()
    }
}
