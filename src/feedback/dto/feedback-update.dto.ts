import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateFeedbackDto{

    @IsOptional()
    @IsString()
    comment?:string

    @IsOptional()
    @IsNumber()
    rating?:number
}