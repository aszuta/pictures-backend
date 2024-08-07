import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CommentDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}