import { Body, Controller, UseGuards, Delete, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentDto } from 'src/comment/dto/comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post(':id')
    createComment(@Param('id', ParseIntPipe) id, @Body() addCommentDto: CommentDto): any {
        return this.commentService.createComment(addCommentDto, id);
    }

    @Get(':id')
    getComments(@Param('id', ParseIntPipe) id): any {
        return this.commentService.getComments(id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    deleteComment(@Param('id', ParseIntPipe) id): any {
        return this.commentService.deleteComment(id);
    }
}
