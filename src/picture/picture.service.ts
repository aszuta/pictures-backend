import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { PictureDto } from 'src/picture/dto/picture.dto';
import { RedisService } from 'src/redis/redis.service';
import { PictureRepository } from './picture.repository';

@Injectable()
export class PictureService {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService,
        private readonly pictureRepository: PictureRepository
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
        const tags = addPictureDto.tags;
        const result = await this.pictureRepository.addPicture(data);

        const tagIds = [];

        for (const tag of tags) {
            let tagId;
            const existingTag = await this.pictureRepository.findExistingTag(tag);

            if (existingTag) {
                tagId = existingTag.id;
            } else {
                const insertedTag = await this.pictureRepository.addTag(tag);
                tagId = insertedTag[0];
            }

            tagIds.push(tagId);
        }

        const inserts = tagIds.map(tagId => ({ postId: result[0], tagId: tagId }));
        await this.pictureRepository.addTags(inserts);

        this.redisService.del('dashboard');
    }

    async getPicture(id: number): Promise<any> {
        const picture = await this.pictureRepository.getPictureById(id);
        const tags = await this.pictureRepository.findTagsByPostId(id);
        const votes = await this.pictureRepository.findVotesByPostId(id);

        const votesMap = votes.reduce((obj, vote) => {
            if (!obj[vote.postId]) obj[vote.postId] = {};
            obj[vote.postId][vote.voteType] = vote.count;
            return obj;
        }, {});

        const total = {
            ...picture,
            tags,
            votes: votesMap[picture.id],
        };

        return total;
    }

    async getPictures(): Promise<any> {
        const pictures = await this.pictureRepository.getPictures();
        const votes = await this.pictureRepository.findVotes();

        const votesMap = votes.reduce((obj, vote) => {
            if (!obj[vote.postId]) obj[vote.postId] = {};
            obj[vote.postId][vote.voteType] = vote.count;
            return obj;
        }, {});

        const total = pictures.map((picture) => {
            return {
                ...picture,
                votes: votesMap[picture.id],
            };
        });

        return total;
    }

    async getPictureByUser(id: number): Promise<any> {
        const pictures = await this.pictureRepository.getPictureByUser(id);
        const votes = await this.pictureRepository.findVotes();

        const votesMap = votes.reduce((obj, vote) => {
            if (!obj[vote.postId]) obj[vote.postId] = {};
            obj[vote.postId][vote.voteType] = vote.count;
            return obj;
        }, {});

        const total = pictures.map((picture) => {
            return {
                ...picture,
                votes: votesMap[picture.id],
            };
        });

        return total;
    }

    async removeById(id: number): Promise<void> {
        await this.pictureRepository.removePictureById(id);
    }

    async onModuleInit(): Promise<void> {
        await this.redisService.del('dashboard');
    }
}
