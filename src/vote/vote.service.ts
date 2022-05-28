import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { VoteDto } from 'src/vote/dto/vote.dto';
import { RedisService } from 'src/redis/redis.service';
import { Vote } from './vote.interface';

@Injectable()
export class VoteService {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService,
    ) {}

    async addVote(id: number, addVoteDto: VoteDto): Promise<void> {
        const data = {
            userId: addVoteDto.userId,
            postId: id,
            voteType: addVoteDto.voteType,
        };
        await this.knex<Vote>('vote').insert(data);
        await this.redisService.del('dashboard');
    }

    async getVote(id: number): Promise<Vote> {
        return this.knex<Vote>('vote').select('userId', 'postId', 'voteType').where('postId', id).first();
    }

    async getUserVotes(postId: number, userId: number): Promise<Vote> {
        return this.knex<Vote>('vote').where('postId', postId).andWhere('userId', userId).first();
    }

    async deleteVote(id: number, addVoteDto: VoteDto): Promise<void> {
        await this.knex<Vote>('vote').del().where('userId', addVoteDto.userId).andWhere('postId', id);
    }
}
