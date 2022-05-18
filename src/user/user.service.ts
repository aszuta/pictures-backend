import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserDto } from 'dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectKnex() private knex: Knex,
    ){}

    async create(createUserDto: CreateUserDto): Promise<void> {
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        await this.knex.table('user').insert({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword,
        });
    }

    async uploadFile(avatar: any): Promise<void> {
        const avatarPath = avatar.path.replace(/\\/g, "/");
        await this.knex.table('user').insert('avatar', avatarPath);
    }

    async findOne(email: string): Promise<any> {
        return await this.knex.select().table('user').where('email', email).first();
    }

    async findOneById(id: number): Promise<any> {
        return await this.knex.select().table('user').where('id', id).first();
    }

    async findById(id: number): Promise<any> {
        return await this.knex.select('id', 'name', 'email').table('user').where('id', id).first();
    }

    async findByRefresh(hash: string): Promise<any> {
        return await this.knex.select('id', 'name', 'email').table('user').where('refresh', hash).first();
    }

    async remove(id: number): Promise<void> {
        await this.knex.table('user').where('id', id).del();
        if(!id){
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }

    async setCurrentRefreshToken(refreshToken: string, id: number): Promise<void> {
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        const hashedRefreshToken = refreshToken;
        await this.knex.table('user').where('id', id).update({
            refresh: hashedRefreshToken
        });
    }

    async removeRefreshToken(id: number): Promise<void>{
        console.log(id);
        await this.knex.table('user').where('id', id).update({
            refresh: null
        })
    }

    async compareRefreshTokens(refreshToken: string, email: string): Promise<any> {
        const user = await this.findOne(email);
        const isRefreshTokensMatching = await bcrypt.compare(refreshToken, user.hash);
        if(isRefreshTokensMatching){
            return user;
        }
    }
}
