import { Body, Controller, Post, Param, Delete, Get, ParseIntPipe, Query } from '@nestjs/common';
import { VoteService } from 'src/vote/vote.service';
import { VoteDto } from 'src/vote/dto/vote.dto';

@Controller('vote')
export class VoteController {
    constructor(
        private readonly voteService: VoteService
    ) {}

    @Post(':id')
    addVote(@Param('id', ParseIntPipe) id, @Body() addVoteDto: VoteDto): any {
        return this.voteService.addVote(id, addVoteDto);
    }

    @Get(':id')
    getVote(@Param('id', ParseIntPipe) id): any {
        return this.voteService.getVote(id);
    }

    @Get()
    getUserVotes(@Query('postId', ParseIntPipe) postId: number, @Query('userId', ParseIntPipe) userId: number): any {
        return this.voteService.getUserVotes(postId, userId);
    }

    @Delete(':id')
    deleteVote(@Param('id', ParseIntPipe) id, @Body() addVoteDto: VoteDto): any {
        return this.voteService.deleteVote(id, addVoteDto);
    }
}
