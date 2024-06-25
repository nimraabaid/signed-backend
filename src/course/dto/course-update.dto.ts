import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsOptional,
  IsEnum,
  IsNumberString,
} from 'class-validator';
import { UserCourse } from '../entities/usercourse.entity';
import { Course, CourseType } from '../entities/course.entity';
import { User } from 'src/user/entity/user.entity';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsEnum(CourseType)
  type?: CourseType;

  @IsOptional()
  @IsNumberString()
  overall_rating?: number;
}

export class UpdateUserCourseDto{
  @IsNotEmpty()
  user:User;
  
  @IsNotEmpty()
  course:Course;
}
