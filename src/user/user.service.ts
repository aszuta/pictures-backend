import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UserDto } from 'src/user/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectKnex() private knex: Knex,
        private readonly userRepository: UserRepository
    ){}

    async create(createUserDto: UserDto): Promise<void> {
        const salt = await bcrypt.genSalt(16);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const data = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashedPassword
        };

        await this.userRepository.create(data);
    }

    findOne(email: string): Promise<User> {
        return this.userRepository.findOne(email);
    }

    async findOneById(id: number): Promise<User> {
        return this.userRepository.findOneById(id);
    }

    async findById(id: number): Promise<Record<string, any>> {
        return this.userRepository.findById(id);
    }

    async findByRefresh(hash: string): Promise<Record<string, any>> {
        return this.userRepository.findByRefresh(hash);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.remove(id);
    }

    async setCurrentRefreshToken(refreshToken: string, id: number): Promise<void> {
        await this.userRepository.setCurrentRefreshToken(refreshToken, id);
    }

    async removeRefreshToken(id: number): Promise<void>{
        await this.userRepository.removeRefreshToken(id);
    }

    async compareRefreshTokens(refreshToken: string, email: string): Promise<any> {
        const user = await this.userRepository.findOne(email);
        const isRefreshTokensMatching = await bcrypt.compare(refreshToken, user.refresh);
        if(isRefreshTokensMatching){
            return user;
        }
    }
}
