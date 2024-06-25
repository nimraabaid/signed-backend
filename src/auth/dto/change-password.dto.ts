import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";


export class ChangePasswordDto{

    @IsNotEmpty()
    oldPass:string

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/, {
      message:
        'Password must contain at least 6 characters, one uppercase letter, one special character, and one number',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/, {
      message:
        'Password must contain at least 6 characters, one uppercase letter, one special character, and one number',
    })
    confirmPass: string;
}