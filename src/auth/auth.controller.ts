import { Body, Controller,Get,HttpCode,HttpStatus,Param,ParseIntPipe,Post,Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

import { SetMetadata } from '@nestjs/common';
import { CreateUserCourseDto } from 'src/course/dto/course-create.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


@Controller('auth')
export class AuthController {
    constructor( private authService:AuthService){}

//     @Post('/login')
//   async login(@Request() req:any) {
//     return this.authService.login(req.user)
//   }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Request() req:any) {
    // console.log(req);
    return this.authService.signIn(req.body);
  }

  @Post(':id/change-password')
  changePassword(
    @Param('id',ParseIntPipe) id:number,
    @Body() changePassworddto:ChangePasswordDto
  ){
    try{
      return this.authService.changePassword(id,changePassworddto)
    }catch(error){
      throw error;
    }
  }

 //
}
