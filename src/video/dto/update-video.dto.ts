import { IsNumber, IsOptional, IsString } from "class-validator";
import { Course } from "src/course/entities/course.entity";
import { Entity } from "typeorm";


export class UpdateVideoDto{
   
    @IsOptional()
    @IsNumber()
    id?:number

    @IsOptional()
    @IsString()
    title?:string
    
    @IsOptional()
    @IsString()
    videoUrl?:string

    @IsOptional()
    @IsNumber()
    course?:Course;
}