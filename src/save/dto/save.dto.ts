import { IsNotEmpty, IsNumber } from "class-validator";

export class SaveDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    postId: number;
}