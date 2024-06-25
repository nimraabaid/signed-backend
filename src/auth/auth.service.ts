import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { error } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { UpdateUserDto } from 'src/user/dto/user-update.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(usersignin: any): Promise<any> {
    const user = await this.userService.findByEmail(usersignin.email);
    if (user.status == 'inactive') {
      throw new UnauthorizedException(
        'Email not found!Please Signup to use SignEd.',
      );
    }
    if (user?.password !== usersignin.password) {
      throw new UnauthorizedException('Invalid credentilas');
    }
    console.log(user);
    //strip password from user property
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      name: user.name,
    };
    //console.log("this is the payload from auth"+{payload})
    return {
      access_token: await this.jwtService.signAsync(payload),
      payload,
    };
  }

  async changePassword(id: number, changePassworddto: ChangePasswordDto) {
    try {
      const user = await this.userService.findOneforChangePasword(id);
      if (user.password != changePassworddto.oldPass) {
        throw new HttpException(
          'Old password is incorrect',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (changePassworddto.password !== changePassworddto.confirmPass) {
        throw new HttpException(
          'Password Not Matched!',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const updateUserDto: UpdateUserDto = {
          password: changePassworddto.password,
        };
        const updatedPass = await this.userService.update(updateUserDto, id);
        return updatedPass;
      }
    } catch (error) {
      throw error;
    }
  }
}
