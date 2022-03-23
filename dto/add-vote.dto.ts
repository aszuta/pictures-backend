import { IsNotEmpty, IsString, IsNumber } from "class-validator";

export class AddVoteDto {
    @IsNotEmpty()
    @IsString()
    voteType: string;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}