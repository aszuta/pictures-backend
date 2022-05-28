import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CommentDto } from 'src/comment/dto/comment.dto';
import { Comment } from './comment.interface';

@Injectable()
export class CommentService {
    constructor(
        @InjectKnex() private knex: Knex,
    ) {}

    async createComment(addCommentDto: CommentDto, id: number): Promise<void> {
        const data = {
            postId: id,
            name: addCommentDto.name,
            content: addCommentDto.content,
            createdAt: new Date(),
        };
        await this.knex.table<Comment>('comment').insert(data);
    }

    async getComments(id: number): Promise<Record<string, any>> {
        return this.knex.table<Comment>('comment').where('postId', id);
    }

    async deleteComment(id: number): Promise<void> {
        await this.knex.table('comment').del().where('id', id);
    }
}
