import { IsNotEmpty, IsString, IsNumber, IsPositive, IsArray, ArrayNotEmpty, ArrayUnique, IsOptional, IsEnum, ValidateNested, IsNumberString } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import { UserCourse } from '../entities/usercourse.entity';
import { Course, CourseType } from '../entities/course.entity';
import { Video } from 'src/video/enities/video.entity';
import { Type } from 'class-transformer';
import { CreateVideoDto } from 'src/video/dto/create-video.dto';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  price: string;
  
  @IsNotEmpty()
  @IsString()
  createdBy: string;

  
  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @IsOptional()
  @IsNumberString()
  overall_rating?: number;
  
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVideoDto)
  videos?: CreateVideoDto[];
}

export class CreateUserCourseDto{
  @IsNotEmpty()
  user:User;
  
  @IsNotEmpty()
  course:Course;
}
