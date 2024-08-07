import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { SaveDto } from './dto/save.dto';

@Injectable()
export class SaveService {
    constructor(
        @InjectKnex() private knex: Knex,
    ){}

    async save(savePictureDto: SaveDto): Promise<void> {
        await this.knex('saved').insert({
            userId: savePictureDto.userId,
            postId: savePictureDto.postId,
        });
    }

    async findOne(userId: number): Promise<any> {
        return this.knex('saved').select().where('userId', userId).first();
    }

    async getUserVotes(userId: number, postId: number): Promise<boolean> {
        const result = await this.knex('saved').where('userId', userId).andWhere('postId', postId).first();
        return !!result;
    }

    async deleteSave(addSaveDto: SaveDto): Promise<void> {
        await this.knex('saved').del().where('userId', addSaveDto.userId).andWhere('postId', addSaveDto.postId);
    }
}
