import { Body, Controller, Delete, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from 'src/comment/dto/comment.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) {}

    @Post(':id')
    createComment(@Param('id', ParseIntPipe) id, @Body() addCommentDto: CommentDto): any {
        return this.commentService.createComment(addCommentDto, id);
    }

    @Get(':id')
    getComments(@Param('id', ParseIntPipe) id): any {
        return this.commentService.getComments(id);
    }

    @Delete(':id')
    deleteComment(@Param('id', ParseIntPipe) id): any {
        return this.commentService.deleteComment(id);
    }
}
