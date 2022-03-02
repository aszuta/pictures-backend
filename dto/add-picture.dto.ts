import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class AddPictureDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    createdBy: number;
}