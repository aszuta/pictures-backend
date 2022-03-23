import { Body, Controller, Post, Param, Delete, Get } from '@nestjs/common';
import { VoteService } from 'src/vote/vote.service';
import { AddVoteDto } from 'dto/add-vote.dto';

@Controller('api/vote')
export class VoteController {
    constructor(
        private readonly voteService: VoteService
    ) {}

    @Post(':id')
    addVote(@Param('id') id: number, @Body() addVoteDto: AddVoteDto){
        console.log(id);
        console.log(addVoteDto);
        return this.voteService.addVote(id, addVoteDto);
    }

    @Get(':id')
    getVote(@Param('id') postId: number){
        return this.voteService.getVote(postId);
    }

    @Get(':postId/:userId')
    getUserVotes(@Param('postId') postId: number, @Param('userId') userId: number){
        return this.voteService.getUserVotes(postId, userId);
    }

    @Delete(':id')
    deleteVote(@Param('id') id: number, @Body() addVoteDto: AddVoteDto){
        return this.voteService.deleteVote(id, addVoteDto);
    }
}
