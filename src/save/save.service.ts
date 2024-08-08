import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { SaveDto } from './dto/save.dto';
import { SaveRepository } from './save.repository';

@Injectable()
export class SaveService {
    constructor(
        @InjectKnex() private knex: Knex,
        private readonly saveRepository: SaveRepository
    ){}

    async save(savePictureDto: SaveDto): Promise<void> {
        const data = {
            userId: savePictureDto.userId,
            postId: savePictureDto.postId
        };
        await this.saveRepository.savePost(data);
    }

    findOne(userId: number): Promise<any> {
        return this.saveRepository.findOne(userId);
    }

    async getUserVotes(userId: number, postId: number): Promise<boolean> {
        return await this.saveRepository.getUserVotes(userId, postId);
    }

    async deleteSave(postId: number, userId: number): Promise<void> {
        await this.saveRepository.deleteSave(postId, userId);
    }
}
