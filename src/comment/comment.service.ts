import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CommentDto } from 'src/comment/dto/comment.dto';
import { Comment } from './comment.interface';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
    constructor(
        @InjectKnex() private knex: Knex,
        private readonly commentRepository: CommentRepository
    ) {}

    async createComment(addCommentDto: CommentDto, id: number): Promise<void> {
        const data = {
            postId: id,
            ...addCommentDto,
        };
        return await this.commentRepository.addComment(data);
    }

    async getComments(id: number): Promise<Comment[]> {
        return await this.commentRepository.getComments(id);
    }

    async deleteComment(id: number): Promise<void> {
        await this.commentRepository.deleteComment(id);
    }
}
