import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { VoteDto } from 'src/vote/dto/vote.dto';
import { RedisService } from 'src/redis/redis.service';
import { Vote } from './vote.interface';
import { VoteRepository } from './vote.repository';

@Injectable()
export class VoteService {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService,
        private readonly voteRepository: VoteRepository
    ) {}

    async addVote(id: number, addVoteDto: VoteDto): Promise<void> {
        const data = {
            userId: addVoteDto.userId,
            postId: id,
            voteType: addVoteDto.voteType,
        };
        await this.voteRepository.addVote(data);
        await this.redisService.del('dashboard');
    }

    async getVote(id: number): Promise<Vote> {
        return await this.voteRepository.getVote(id);
    }

    async getUserVotes(postId: number, userId: number): Promise<Vote> {
        return await this.voteRepository.getUserVotes(postId, userId);
    }

    async deleteVote(postId: number, userId: number): Promise<void> {
        await this.voteRepository.deleteVote(postId, userId);
    }
}
