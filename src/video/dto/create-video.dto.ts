import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Course } from "src/course/entities/course.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

export class CreateVideoDto{
  
    @IsNotEmpty()
    @IsString()
    title:string

    @IsNotEmpty()
    @IsString()
    videoUrl:string

    @IsOptional()
    @IsNumber()
    course?:Course;
}