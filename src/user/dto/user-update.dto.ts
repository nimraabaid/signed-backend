import { IsOptional, IsString, IsEmail, MinLength, Matches, IsDateString, IsArray, IsEnum } from 'class-validator';
import { Role } from '../enums/role.enum';
import { UserCourse } from 'src/course/entities/usercourse.entity';
import { UserStatus } from '../entity/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must contain at least 6 characters, one uppercase letter, one special character, and one number',
  })
  password?: string;

  @IsOptional()
  @IsDateString()
  dob?: Date;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  mobile?: string;

  @IsString()
  @IsOptional()
  imageUrl?:string
  
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
