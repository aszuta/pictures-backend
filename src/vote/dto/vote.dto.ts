import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class VoteDto {
    @IsNotEmpty()
    @IsString()
    voteType: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}