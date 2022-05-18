import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AddCommentDto } from 'dto/add-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectKnex() private knex: Knex,
    ) {}

    async createComment(addCommentDto: AddCommentDto, id: number): Promise<void> {
        const data = {
            postId: id,
            name: addCommentDto.name,
            content: addCommentDto.content,
            createdAt: new Date(),
        };
        await this.knex.table('comment').insert(data);
    }

    async getComments(id: number): Promise<any> {
        const comments = await this.knex.table('comment').where('postId', id);
        return comments;
    }

    async deleteComment(id: number): Promise<void> {
        await this.knex.table('comment').del().where('id', id);
    }
}
