import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UserDto } from 'src/user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectKnex() private knex: Knex,
    ){}

    async create(createUserDto: UserDto): Promise<void> {
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        await this.knex<User>('user').insert({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
        });
    }

    async findOne(email: string): Promise<User> {
        return this.knex<User>('user').select().where('email', email).first();
    }

    async findOneById(id: number): Promise<User> {
        return this.knex<User>('user').select().where('id', id).first();
    }

    async findById(id: number): Promise<Record<string, any>> {
        return this.knex<User>('user').select('id', 'name', 'email').where('id', id).first();
    }

    async findByRefresh(hash: string): Promise<Record<string, any>> {
        return this.knex<User>('user').select('id', 'name', 'email').where('refresh', hash).first();
    }

    async remove(id: number): Promise<void> {
        await this.knex<User>('user').where('id', id).del();
    }

    async setCurrentRefreshToken(refreshToken: string, id: number): Promise<void> {
        await this.knex<User>('user').where('id', id).update({
            refresh: refreshToken
        });
    }

    async removeRefreshToken(id: number): Promise<void>{
        await this.knex<User>('user').where('id', id).update({
            refresh: null
        })
    }

    async compareRefreshTokens(refreshToken: string, email: string): Promise<any> {
        const user = await this.findOne(email);
        const isRefreshTokensMatching = await bcrypt.compare(refreshToken, user.refresh);
        if(isRefreshTokensMatching){
            return user;
        }
    }
}
