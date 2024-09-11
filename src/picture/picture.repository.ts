import { Injectable } from "@nestjs/common";
import { InjectKnex, Knex } from "nestjs-knex";
import { Picture } from "./picture.interface";
import { Tag } from "./tag.interface";

@Injectable()
export class PictureRepository {
    constructor(
        @InjectKnex() private knex: Knex
    ) {}

    async addPicture(data: object): Promise<any> {
        return await this.knex.table<Picture>('picture').insert(data);
    }

    async getPictures(): Promise<Picture[]> {
        return await this.knex('picture')
            .join('user', 'picture.createdBy', 'user.id')
            .select('picture.*', 'user.name as username');
    }

    async getPictureById(id: number): Promise<any> {
        return await this.knex('picture')
            .join('user', 'picture.createdBy', 'user.id')
            .select('picture.*', 'user.name as username')
            .where('picture.id', id)
            .first();
    }

    async getPictureByUser(id: number): Promise<Picture[]> {
        return await this.knex('picture')
            .join('user', 'picture.createdBy', 'user.id')
            .select('picture.*', 'user.name as username')
            .where('createdBy', id);
    }

    async findTags(): Promise<any> {
        return await this.knex('tags')
            .join('picture_tags', 'tags.id', 'picture_tags.tagId')
            .join('picture', 'picture_tags.postId', 'picture.id')
            .select('*');
    }

    async findExistingTag(name: any): Promise<Tag> {
        return await this.knex('tags').where('name', name).first();
    }

    async findTagsByPostId(id: number): Promise<any> {
        return await this.knex('tags')
            .join('picture_tags', 'tags.id', 'picture_tags.tagId')
            .join('picture', 'picture_tags.postId', 'picture.id')
            .where('picture_tags.postId', id)
            .select('tags.*');
    }

    async findPostsByTag(tag: string): Promise<any> {
        return await this.knex('picture').distinct('picture.*')
            .innerJoin('picture_tags', 'picture.id', 'picture_tags.postId')
            .innerJoin('tags', 'picture_tags.tagId', 'tags.id')
            .where('tags.name', tag)
    }

    async findPostsByTags(tag: string[]): Promise<any> {
        return await this.knex('picture').distinct('picture.*')
            .innerJoin('picture_tags', 'picture.id', 'picture_tags.postId')
            .innerJoin('tags', 'picture_tags.tagId', 'tags.id')
            .whereIn('tags.name', tag)
            .groupBy('picture.id');
    }

    async addTag(name: any): Promise<Tag> {
        return await this.knex('tags').insert({name: name});
    }

    async addTags(data: object): Promise<void> {
        await this.knex('picture_tags').insert(data);
    }

    async findVotes(): Promise<any> {
        return await this.knex('vote')
            .select([
                'postId',
                'voteType',
                this.knex.raw('COUNT(voteType) as count'),
            ])
            .groupBy(['postId', 'voteType']);
    }

    async findVotesByPostId(id: number): Promise<any> {
        return await this.knex('vote')
            .select([
                'postId',
                'voteType',
                this.knex.raw('COUNT(voteType) as count'),
            ])
            .where('postId', id)
            .groupBy(['postId', 'voteType']);
    }

    async findSaved(id: number): Promise<any> {
        return await this.knex('saved')
            .join('picture', 'saved.postId', 'picture.id')
            .join('user', 'picture.createdBy', 'user.id')
            .select('picture.*', 'user.name as username')
            .where('saved.userId', id);
    }

    async removePictureById(id: number): Promise<void> {
        await this.knex<Picture>('picture').where('id', id).del();
    }
}