import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Param, Delete, Body, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PictureDto } from 'src/picture/dto/picture.dto';
import { multerOptions } from 'src/config/multerOptions';
import { PictureService } from './picture.service';

@Controller('picture')
export class PictureController {
    constructor(
        private readonly pictureService: PictureService
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('picture', multerOptions))
    uploadFile(@UploadedFile() file, @Req() req, @Body() addPictureDto: PictureDto): Promise<void> {
        return this.pictureService.uploadFile(addPictureDto, req.file);
    }

    @Get(':id')
    async getFile(@Param('id', ParseIntPipe) id): Promise<any> {
        return await this.pictureService.findOne(id);
    }

    @Get()
    async getFiles(): Promise<any> {
        return await this.pictureService.getPicturesWithVotes();
    }

    @Get('file/:id')
    async getPictures(@Param('id', ParseIntPipe) id): Promise<any> {
        return await this.pictureService.getPicturesById(id);
    }

    @Delete(':id')
    async deleteFile(@Param('id', ParseIntPipe) id): Promise<any> {
        return await this.pictureService.removeById(id);
    }
}
