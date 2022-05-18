import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AddPictureDto } from 'dto/add-picture.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PictureService {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService,
    ) {}

    async uploadFile(addPictureDto: AddPictureDto, picture: any): Promise<void> {
        const path = picture.path.replace(/\\/g, "/");
        const data = {
            title: addPictureDto.title,
            createdBy: addPictureDto.createdBy,
            filename: picture.filename,
            filepath: path,
            mimetype: picture.mimetype,
        };
        await this.knex.table('picture').insert(data);
        this.redisService.del('dashboard');
    }

    async findOne(id: number): Promise<any> {
        return await this.knex
            .select(
                'id', 
                'title', 
                'createdBy',
                this.knex.raw(`(SELECT name FROM picturesapp.user WHERE picturesapp.user.id = picturesapp.picture.createdBy) AS name`),
                'createdAt', 
                'filename', 
                'filepath',
                this.knex.raw(`(SELECT COUNT(voteType) FROM picturesapp.vote WHERE voteType="voteUp" AND picturesapp.vote.postId = picturesapp.picture.id) AS votesUp`),
                this.knex.raw(`(SELECT COUNT(voteType) FROM picturesapp.vote WHERE voteType="voteDown" AND picturesapp.vote.postId = picturesapp.picture.id) AS votesDown`))
            .from('picture').where('id', id).first();
    }

    async getPicturesWithVotes(): Promise<any> {
        const pictures = await this.knex
            .select(
                'id', 
                'title', 
                'createdBy',
                this.knex.raw(`(SELECT name FROM picturesapp.user WHERE picturesapp.user.id = picturesapp.picture.createdBy) AS name`),
                'createdAt', 
                'filename', 
                'filepath',
                this.knex.raw(`(SELECT COUNT(voteType) FROM picturesapp.vote WHERE voteType="voteUp" AND picturesapp.vote.postId = picturesapp.picture.id) AS votesUp`),
                this.knex.raw(`(SELECT COUNT(voteType) FROM picturesapp.vote WHERE voteType="voteDown" AND picturesapp.vote.postId = picturesapp.picture.id) AS votesDown`))
            .from('picture');

        await this.redisService.set('dashboard', JSON.stringify(pictures), 86400);
        const cachedPictures = await this.redisService.get('dashboard');
        return JSON.parse(cachedPictures);
    }

    async getPicturesById(id: number): Promise<any> {
        const pictures = await this.knex
            .select(
                'id',
                'title',
                'createdBy',
                this.knex.raw(`(SELECT name FROM picturesapp.user WHERE picturesapp.user.id = picturesapp.picture.createdBy) AS name`),
                'createdAt',
                'filename',
                'filepath',
                this.knex.raw(`(SELECT COUNT(voteType) FROM picturesapp.vote WHERE voteType="voteUp" AND picturesapp.vote.postId = picturesapp.picture.id) AS votesUp`),
                this.knex.raw(`(SELECT COUNT(voteType) FROM picturesapp.vote WHERE voteType="voteDown" AND picturesapp.vote.postId = picturesapp.picture.id) AS votesDown`))
            .from('picture').where('createdBy', id);
        
            await this.redisService.set('profile', JSON.stringify(pictures), 86400);
            const cachedPictures = await this.redisService.get('profile');
            return JSON.parse(cachedPictures);
    }

    async removeById(id: number): Promise<void> {
        await this.knex.table('picture').where('id', id).del();
    }
}
