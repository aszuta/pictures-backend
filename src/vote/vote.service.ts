import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AddVoteDto } from 'dto/add-vote.dto';

@Injectable()
export class VoteService {
    constructor(
        @InjectKnex() private knex: Knex
    ) {}

    async addVote(id: number, addVoteDto: AddVoteDto){
        const data = {
            userId: addVoteDto.userId,
            postId: id,
            voteType: addVoteDto.voteType,
        };
        console.log(data);
        await this.knex.table('vote').insert(data);
    }

    async getVote(id: number){
        // const votes = await this.knex.select
        // (['postId', 'voteType', this.knex.raw('COUNT(voteType) as count')])
        // .table('vote').groupBy('voteType').groupByRaw('postId');
        // return votes;
        console.log(id);
        const vote = await this.knex.select('userId', 'postId', 'voteType').table('vote').where('postId', id).first();
        console.log(vote);
        return vote;
    }

    async getUserVotes(postId: number, userId: number) {
        console.log(userId);
        console.log(postId);
        const vote = await this.knex.table('vote').where('postId', postId).andWhere('userId', userId).first();
        console.log(vote);
        return vote;
    }

    async deleteVote(id: number, addVoteDto: AddVoteDto){
        console.log(id);
        console.log(addVoteDto.userId);
        await this.knex.table('vote').del().where('userId', addVoteDto.userId).andWhere('postId', id);
    }
}
