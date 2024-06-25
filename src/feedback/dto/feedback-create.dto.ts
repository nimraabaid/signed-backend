import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Course } from "src/course/entities/course.entity"
import { User } from "src/user/entity/user.entity"

export class CreateFeedbackDto{

    @IsNotEmpty()
    @IsString()
    comment:string

    @IsNotEmpty()
    @IsNumber()
    rating:number

    @IsNotEmpty()
    @IsNumber()
    course:Course

    @IsNotEmpty()
    @IsNumber()
    user:User
}