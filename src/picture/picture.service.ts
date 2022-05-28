import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { PictureDto } from 'src/picture/dto/picture.dto';
import { RedisService } from 'src/redis/redis.service';
import { Picture } from './picture.interface';

@Injectable()
export class PictureService {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService,
    ) {}

    async uploadFile(addPictureDto: PictureDto, picture: any): Promise<void> {
        const path = picture.path.replace(/\\/g, "/");
        const data = {
            title: addPictureDto.title,
            createdBy: addPictureDto.createdBy,
            filename: picture.filename,
            filepath: path,
            mimetype: picture.mimetype,
        };
        await this.knex.table<Picture>('picture').insert(data);
        this.redisService.del('dashboard');
    }

    async findOne(id: number): Promise<Picture> {
        return this.knex<Picture>('picture')
            .select(
                'id',
                'title',
                'createdBy',
                this.knex.raw(`(SELECT name FROM user WHERE user.id = picture.createdBy) AS name`),
                'createdAt',
                'filename',
                'filepath',
                this.knex.raw(`(SELECT COUNT(voteType) FROM vote WHERE voteType="voteUp" AND vote.postId = picture.id) AS votesUp`),
                this.knex.raw(`(SELECT COUNT(voteType) FROM vote WHERE voteType="voteDown" AND vote.postId = picture.id) AS votesDown`))
            .where('id', id).first();
    }

    async getPicturesWithVotes(): Promise<any> {
        const pictures = await this.knex('picture')
            .select(
                'id',
                'title',
                'createdBy',
                this.knex.raw(`(SELECT name FROM user WHERE user.id = picture.createdBy) AS name`),
                'createdAt',
                'filename',
                'filepath',
                this.knex.raw(`(SELECT COUNT(voteType) FROM vote WHERE voteType="voteUp" AND vote.postId = picture.id) AS votesUp`),
                this.knex.raw(`(SELECT COUNT(voteType) FROM vote WHERE voteType="voteDown" AND vote.postId = picture.id) AS votesDown`));

        await this.redisService.set('dashboard', JSON.stringify(pictures), 86400);
        const cachedPictures = await this.redisService.get('dashboard');
        return JSON.parse(cachedPictures);
    }

    async getPicturesById(id: number): Promise<Picture> {
        const pictures = await this.knex<Picture>('picture')
            .select(
                'id',
                'title',
                'createdBy',
                this.knex.raw(`(SELECT name FROM user WHERE user.id = picture.createdBy) AS name`),
                'createdAt',
                'filename',
                'filepath',
                this.knex.raw(`(SELECT COUNT(voteType) FROM vote WHERE voteType="voteUp" AND vote.postId = picture.id) AS votesUp`),
                this.knex.raw(`(SELECT COUNT(voteType) FROM vote WHERE voteType="voteDown" AND vote.postId = picture.id) AS votesDown`))
            .where('createdBy', id);
        
            await this.redisService.set('profile', JSON.stringify(pictures), 86400);
            const cachedPictures = await this.redisService.get('profile');
            return JSON.parse(cachedPictures);
    }

    async removeById(id: number): Promise<void> {
        await this.knex<Picture>('picture').where('id', id).del();
    }
}
