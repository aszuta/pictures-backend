import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { AddPictureDto } from 'dto/add-picture.dto';

@Injectable()
export class PictureService {
    constructor(
        @InjectKnex() private knex: Knex,
    ) {}

    async uploadFile(addPictureDto: AddPictureDto, picture: any){
        const path = picture.path.replace(/\\/g, "/");
        const data = {
            title: addPictureDto.title,
            createdBy: addPictureDto.createdBy,
            filename: picture.filename,
            filepath: path,
            mimetype: picture.mimetype,
            size: picture.size,
        };
        await this.knex.table('picture').insert(data);
    }

    async findOne(fileName: string) {
        const picture = await this.knex.table('picture').where('filename', fileName).first();
        return picture;
    }

    async findAll() {
        const pictures = await this.knex.select().table('picture');
        console.log(pictures);
        return pictures;
    }

    async findById(id: number) {
        const pictures = await this.knex.select().table('picture').where('createdBy', id).first();
        return pictures;
    }

    async removeById(id: number) {
        return await this.knex.table('picture').del().where('id', id);
    }
}
