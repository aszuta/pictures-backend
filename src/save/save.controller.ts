import { Body, Controller, UseGuards, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { SaveService } from './save.service';
import { SaveDto } from './dto/save.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('savePost')
export class SaveController {
    constructor(
        private readonly saveService: SaveService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    addSave(@Body() addSaveDto: SaveDto): Promise<void> {
        return this.saveService.save(addSaveDto);
    }

    @Get(':id')
    getSave(@Param('id', ParseIntPipe) id): any {
        return this.saveService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserSave(@Query('userId', ParseIntPipe) userId: number, @Query('postId', ParseIntPipe) postId: number): Promise<boolean> {
        return await this.saveService.getUserVotes(userId, postId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete()
    deleteSave(@Query('postId', ParseIntPipe) postId: number, @Query('userId', ParseIntPipe) userId: number): any {
        return this.saveService.deleteSave(postId, userId);
    }
}
