import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Req, Get, Param, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PictureDto } from 'src/picture/dto/picture.dto';
import { multerOptions } from 'src/config/multerOptions';
import { PictureService } from './picture.service';
import { InjectKnex, Knex } from 'nestjs-knex';
import { RedisService } from 'src/redis/redis.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('picture')
export class PictureController {
    constructor(
        @InjectKnex() private knex: Knex,
        private redisService: RedisService, 
        private readonly pictureService: PictureService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('picture', multerOptions))
    uploadFile(@UploadedFile() file, @Req() req, @Body() addPictureDto: PictureDto): Promise<void> {
        return this.pictureService.uploadFile(addPictureDto, req.file);
    }

    @Get(':id')
    async getFile(@Param('id', ParseIntPipe) id): Promise<Record<string, any>> {
        return await this.pictureService.getPicture(id);
    }

    @Get()
    async getFiles(): Promise<Record<string, any>> {
        const cachedPictures = await this.redisService.get('dashboard');
        if(cachedPictures) {
            return JSON.parse(cachedPictures);
        } else {
            const total = await this.pictureService.getPictures();
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
            const total = await this.pictureService.getPictureByUser(id);
            this.redisService.set(`profile/user:${id}`, JSON.stringify(total), 86400);
            return total;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteFile(@Param('id', ParseIntPipe) id): Promise<any> {
        return await this.pictureService.removeById(id);
    }
}
