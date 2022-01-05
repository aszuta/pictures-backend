import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class PictureService {
    constructor(
        @InjectKnex() private knex: Knex,
    ) {}


    async something() {
        const picture = await this.knex('picture').where({
            id: 1,
        }).first();
    }
}
