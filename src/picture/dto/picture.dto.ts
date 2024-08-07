import { IsNotEmpty, IsString, IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TagDto } from "./tag.dto";

export class PictureDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    createdBy: number;

    @IsArray()
    @ValidateNested()
    @Type(() => TagDto)
    tags: TagDto[];

}