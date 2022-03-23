import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AddCommentDto } from 'dto/add-comment.dto';

@Controller('api/comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Post(':id')
    createComment(@Param('id') id: number, @Body() addCommentDto: AddCommentDto){
        return this.commentService.createComment(addCommentDto, id);
    }

    @Get(':id')
    getComments(@Param('id') id: number){
        return this.commentService.getComments(id);
    }

    @Delete(':id')
    deleteComment(@Param('id') id: number){
        return this.commentService.deleteComment(id);
    }
}
