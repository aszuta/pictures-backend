import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";

@Injectable()
export class CommentRepository {
    constructor(
        @InjectKnex() private knex: Knex
    ) {}

    async addComment(data: object): Promise<void> {
        await this.knex.table<Comment>('comment').insert(data);
    }

    async getComments(id: number): Promise<any> {
        return await this.knex.table<Comment>('comment').where('postId', id);
    }

    async deleteComment(id: number): Promise<void> {
        await this.knex.table('comment').del().where('id', id);
    }
}