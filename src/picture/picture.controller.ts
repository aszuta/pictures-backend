import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Param, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PictureDto } from 'src/picture/dto/picture.dto';
import { multerOptions } from 'src/config/multerOptions';
import { PictureService } from './picture.service';
import { InjectKnex, Knex } from 'nestjs-knex';
import { RedisService } from 'src/redis/redis.service';

@Controller('picture')
export class PictureController {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService, 
        private readonly pictureService: PictureService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('picture', multerOptions))
    uploadFile(@UploadedFile() file, @Req() req, @Body() addPictureDto: PictureDto): Promise<void> {
        return this.pictureService.uploadFile(addPictureDto, req.file);
    }

    @Get(':id')
    async getFile(@Param('id', ParseIntPipe) id): Promise<Record<string, any>> {
        const picture = await this.knex('picture').where('id', id).first();

        const votes = await this.knex('vote')
            .select([
                'postId',
                'voteType',
                this.knex.raw('COUNT(voteType) as count'),
            ])
            .where('postId', id)
            .groupBy(['postId', 'voteType']);

        const votesMap = votes.reduce((obj, vote) => {
            if (!obj[vote.postId]) obj[vote.postId] = {};
            obj[vote.postId][vote.voteType] = vote.count;
            return obj;
        }, {});

        const total = {
            ...picture,
            votes: votesMap[picture.id],
        };

        return total;
    }

    @Get()
    async getFiles(): Promise<Record<string, any>> {
        const cachedPictures = await this.redisService.get('dashboard');
        if(cachedPictures) {
            return JSON.parse(cachedPictures);
        } else {
            const pictures = await this.knex('picture');

            const votes = await this.knex('vote')
                .select([
                    'postId',
                    'voteType',
                    this.knex.raw('COUNT(voteType) as count'),
                ])
                .groupBy(['postId', 'voteType']);

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

            await this.redisService.set('dashboard', JSON.stringify(total), 86400);
            return total;
        }
    }

    @Get('file/:id')
    async getPictures(@Param('id', ParseIntPipe) id): Promise<Record<string, any>> {
        const cachedPictures = await this.redisService.get(`profile/user:${id}`);
        if(cachedPictures) {
            return JSON.parse(cachedPictures);
        } else {
            const pictures = await this.knex('picture').where('createdBy', id);

            const votes = await this.knex('vote')
                .select([
                    'postId',
                    'voteType',
                    this.knex.raw('COUNT(voteType) as count'),
                ])
                .groupBy(['postId', 'voteType']);

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

            this.redisService.set(`profile/user:${id}`, JSON.stringify(total), 86400);
            return total;
        }
    }

    @Delete(':id')
    async deleteFile(@Param('id', ParseIntPipe) id): Promise<any> {
        return await this.pictureService.removeById(id);
    }
}
