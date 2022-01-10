import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService){}

    async validateUser(email: string, password: string){
        const user = await this.userService.findOne(email);
        const comparePasswords = bcrypt.compareSync(password, user[3]);

        if(comparePasswords){
            const result = user;
            return result;
        }
    }
}
