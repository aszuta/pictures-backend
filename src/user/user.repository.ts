import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";
import { User } from "./user.interface";

@Injectable()
export class UserRepository {
    constructor(
        @InjectKnex() private knex: Knex
    ) {}

    async create(data: object): Promise<void> {
        await this.knex<User>('user').insert(data);
    }

    findOne(email: string): Promise<User> {
        return this.knex<User>('user').select().where('email', email).first();
    }

    findOneById(id: number): Promise<User> {
        return this.knex<User>('user').select().where('id', id).first();
    }

    findById(id: number): Promise<Record<string, any>> {
        return this.knex<User>('user').select('id', 'name', 'email').where('id', id).first();
    }

    findByRefresh(hash: string): Promise<Record<string, any>> {
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
}