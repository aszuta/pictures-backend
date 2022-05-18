import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from 'dto/add-comment.dto';

@Controller('api/comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Post(':id')
    createComment(@Param('id') id: number, @Body() addCommentDto: AddCommentDto): any {
        return this.commentService.createComment(addCommentDto, id);
    }

    @Get(':id')
    getComments(@Param('id') id: number): any {
        console.log(this.commentService.getComments(id));
        return this.commentService.getComments(id);
    }

    @Delete(':id')
    deleteComment(@Param('id') id: number): any {
        return this.commentService.deleteComment(id);
    }
}
