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
        const tags = addPictureDto.tags;
        const result = await this.knex.table<Picture>('picture').insert(data);

        const tagIds = [];

        for (const tag of tags) {
            let tagId;
            const existingTag = await this.knex('tags').where('name', tag).first();

            if (existingTag) {
                tagId = existingTag.id;
            } else {
                const insertedTag = await this.knex('tags').insert({name: tag});
                tagId = insertedTag[0];
            }

            tagIds.push(tagId);
        }

        const inserts = tagIds.map(tagId => ({ postId: result[0], tagId: tagId }));
        await this.knex('picture_tags').insert(inserts);

        this.redisService.del('dashboard');
    }

    async removeById(id: number): Promise<void> {
        await this.knex<Picture>('picture').where('id', id).del();
    }

    async onModuleInit(): Promise<void> {
        await this.redisService.del('dashboard');
    }
}
