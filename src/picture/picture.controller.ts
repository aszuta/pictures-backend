import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, Req, Get, Param, Delete, Body, ParseIntPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PictureDto } from 'src/picture/dto/picture.dto';
import { multerOptions } from 'src/config/multerOptions';
import { PictureService } from './picture.service';
import { InjectKnex, Knex } from 'nestjs-knex';
import { RedisService } from 'src/redis/redis.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PictureGuard } from './picture.guard';

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

    @UseGuards(PictureGuard)
    @Get(':id')
    async getFile(@Req() req, @Param('id', ParseIntPipe) id): Promise<Record<string, any>> {
        return await this.pictureService.getPicture(id, req.user);
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

    @Get('saved/:id')
    async getSavedPictures(@Param('id', ParseIntPipe) id: number): Promise<Record<string, any>> {
        return await this.pictureService.getSavedPictures(id);
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

    @Get('tag/:tagName')
    async getPicturesByTag(@Param('tagName') tagName: string): Promise<Record<string, any>> {
        return await this.pictureService.getPicturesByTag(tagName);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteFile(@Param('id', ParseIntPipe) id): Promise<any> {
        return await this.pictureService.removeById(id);
    }
}
