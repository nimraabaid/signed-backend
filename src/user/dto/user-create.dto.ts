import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsDateString,
  IsArray,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Role } from '../enums/role.enum';
import { UserCourse } from 'src/course/entities/usercourse.entity';
import { UserStatus } from '../entity/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/, {
    message:
      'Password must contain at least 6 characters, one uppercase letter, one special character, and one number',
  })
  password: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  imageUrl?:string

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;


  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];

  constructor() {
    // Initialize roles with default value "student" if not provided
    if (!this.roles) {
      this.roles = [Role.STUDENT];
    }
  }
  

}
