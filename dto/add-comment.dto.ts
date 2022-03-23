import { IsNotEmpty, IsString } from "class-validator";

export class AddCommentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}