import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserDto } from 'dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectKnex() private knex: Knex,
    ){}

    async create(createUserDto: CreateUserDto){
        try {
            const salt = await bcrypt.genSalt(16);
            const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

            const user = await this.knex.table('user').insert({
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
            });
            return { user };
        } catch (err) {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            throw err;
        }
    }

    async findOne(email: string){
        const user = await this.knex.table('user').where('email', email);
        if(!email){
            throw new NotFoundException('User not found');
        }
        return { user };
    }

    async remove(id: number){
        await this.knex.table('user').where('id', id).del();
        if(!id){
            throw new NotFoundException(`User ${id} does not exist`);
        }
    }
}
