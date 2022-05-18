import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AddVoteDto } from 'dto/add-vote.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class VoteService {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService,
    ) {}

    async addVote(id: number, addVoteDto: AddVoteDto): Promise<void> {
        const data = {
            userId: addVoteDto.userId,
            postId: id,
            voteType: addVoteDto.voteType,
        };
        await this.knex.table('vote').insert(data);
        this.redisService.del('dashboard');
    }

    async getVote(id: number): Promise<any> {
        const vote = await this.knex.select('userId', 'postId', 'voteType').table('vote').where('postId', id).first();
        return vote;
    }

    async getUserVotes(postId: number, userId: number): Promise<any> {
        const vote = await this.knex.table('vote').where('postId', postId).andWhere('userId', userId).first();
        return vote;
    }

    async deleteVote(id: number, addVoteDto: AddVoteDto): Promise<void> {
        await this.knex.table('vote').del().where('userId', addVoteDto.userId).andWhere('postId', id);
    }
}
