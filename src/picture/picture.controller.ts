import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Param, Put, Delete, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddPictureDto } from 'dto/add-picture.dto';
import { multerOptions } from 'src/config/multerOptions';
import { PictureService } from './picture.service';

@Controller('api/picture/')
export class PictureController {
    constructor(
        private readonly pictureService: PictureService
    ) {}

    @Post('file')
    @UseInterceptors(FileInterceptor('picture', multerOptions))
    uploadFile(@UploadedFile() file, @Req() req, @Body() addPictureDto: AddPictureDto){
        const picture = req.file;
        return this.pictureService.uploadFile(addPictureDto, picture);
    }

    @Get('file/:filename')
    async getFile(@Param('filename') filename: string){
        const data = await this.pictureService.findOne(filename);
        return data;
    }

    @Get('files')
    async getFiles() {
        const files = await this.pictureService.findAll();
        return files;
    }

    @Get('pictures')
    async getPictures(@Req() req) {
        const pictures = await this.pictureService.findById(req.user.id);
        return pictures;
    }

    @Put('file/:filename')
    async updateFile(@Param('id') filename: string) {
        const file = await this.pictureService.findOne(filename);
        return file;
    }

    @Delete('file/:id')
    async deleteFile(@Param('id') id: number) {
        return await this.pictureService.removeById(id);
    }
}
