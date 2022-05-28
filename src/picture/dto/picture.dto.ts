import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class PictureDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    createdBy: number;
}