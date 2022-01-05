import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserDto } from 'dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectKnex() private knex: Knex,
    ){}

    async create(createUserDto: CreateUserDto){
        try {
            const user = await this.knex.table('user').insert({
                name: createUserDto.name,
                email: createUserDto.email,
                password: createUserDto.password,
            });
            return { user };
        } catch (err) {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            throw err;
        }
    }

    async remove(id: number){
        if(!id){
            throw new NotFoundException(`User ${id} does not exist`);
        }
        await this.knex.table('user').where('id', id).del();
        
    }
}
