import { Controller, Post, UploadedFile, UseInterceptors, Req, Get, Param, /*Put,*/ Delete, Body } from '@nestjs/common';
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
    uploadFile(@UploadedFile() file, @Req() req, @Body() addPictureDto: AddPictureDto): Promise<void> {
        const picture = req.file;
        return this.pictureService.uploadFile(addPictureDto, picture);
    }

    @Get('file/:id')
    async getFile(@Param('id') id: number): Promise<any> {
        return await this.pictureService.findOne(id);
    }

    @Get('files')
    async getFiles(): Promise<any> {
        return await this.pictureService.getPicturesWithVotes();
    }

    @Get('pictures/:id')
    async getPictures(@Param('id') id: number ): Promise<any> {
        return await this.pictureService.getPicturesById(id);
    }

    // @Put('file/:filename')
    // async updateFile(@Param('id') filename: string) {
    //     const file = await this.pictureService.findOne(filename);
    //     return file;
    // }

    @Delete('file/:id')
    async deleteFile(@Param('id') id: number): Promise<any> {
        return await this.pictureService.removeById(id);
    }
}
