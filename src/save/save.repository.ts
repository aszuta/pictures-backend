import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";

@Injectable()
export class SaveRepository {
    constructor(
        @InjectKnex() private knex: Knex
    ) {}

    async savePost(data: object): Promise<void> {
        await this.knex('saved').insert(data);
    }

    findOne(userId: number): Promise<any> {
        return this.knex('saved').select().where('userId', userId).first();
    }

    async getUserVotes(userId: number, postId: number): Promise<boolean> {
        const result = await this.knex('saved').where('userId', userId).andWhere('postId', postId).first();
        return !!result;
    }

    async deleteSave(postId: number, userId: number): Promise<void> {
        await this.knex('saved').del().where('userId', userId).andWhere('postId', postId);
    }
}