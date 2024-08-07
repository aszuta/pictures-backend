import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { SaveService } from './save.service';
import { SaveDto } from './dto/save.dto';

@Controller('save')
export class SaveController {
    constructor(
        private readonly saveService: SaveService
    ) {}

    @Post()
    addSave(@Body() addSaveDto: SaveDto): Promise<void> {
        return this.saveService.save(addSaveDto);
    }

    @Get(':id')
    getSave(@Param('id', ParseIntPipe) id): any {
        return this.saveService.findOne(id);
    }

    @Get()
    async getUserSave(@Query('userId', ParseIntPipe) userId: number, @Query('postId', ParseIntPipe) postId: number): Promise<boolean> {
        return await this.saveService.getUserVotes(userId, postId);
    }

    @Delete()
    deleteSave(@Body() addSaveDto: SaveDto): any {
        return this.saveService.deleteSave(addSaveDto);
    }
}
