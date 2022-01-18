import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserDto } from 'dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectKnex() private knex: Knex,
    ){}

    async create(createUserDto: CreateUserDto){
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const user = await this.knex.table('user').insert({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
        });
        console.log(JSON.stringify(user));
    }

    async findOne(email: string) {
        return await this.knex.select().table('user').where('email', email).first();
    }

    async remove(id: number){
        await this.knex.table('user').where('id', id).del();
        if(!id){
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }

    async setCurrentRefreshToken(refreshToken: string, id: number){
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.knex.table('user').where('id', id).update({
            hash: hashedRefreshToken
        });
    }

    async compareRefreshTokens(refreshToken: string, email: string){
        const user = await this.findOne(email);
        const isRefreshTokensMatching = await bcrypt.compare(refreshToken, user.hash);
        if(isRefreshTokensMatching){
            return user;
        }
    }
}
