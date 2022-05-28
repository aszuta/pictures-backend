import { IsNotEmpty, IsString } from "class-validator";

export class CommentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}