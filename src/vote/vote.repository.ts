import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";
import { Vote } from "./vote.interface";

@Injectable()
export class VoteRepository {
    constructor(
        @InjectKnex() private knex: Knex
    ) {}

    async addVote(data: object): Promise<void> {
        await this.knex<Vote>('vote').insert(data).onConflict(['userId', 'postId']).merge();
    }

    async getVote(id: number): Promise<Vote> {
        return await this.knex<Vote>('vote').select('userId', 'postId', 'voteType').where('postId', id).first();
    }

    async getUserVotes(postId: number, userId: number): Promise<Vote> {
        return await this.knex<Vote>('vote').where('postId', postId).andWhere('userId', userId).first();
    }

    async deleteVote(postId: number, userId: number): Promise<void> {
        await this.knex<Vote>('vote').del().where('userId', userId).andWhere('postId', postId);
    }
}