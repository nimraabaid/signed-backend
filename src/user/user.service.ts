import {
  ConsoleLogger,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async get(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        order:{
            id:'ASC'
        }
    });
      if (users.length == 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return users;
    } catch (error) {
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const email = createUserDto.email;
      const euser = await this.userRepository.findOneBy({ email });
      if (!euser) {
        try {
          const user = await this.userRepository.save(createUserDto);
          return user;
        } catch (error) {
          throw new HttpException(
            'Internal Sever error.Error may be: invalid input syntax for type date',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new HttpException('Account aleady created!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw error;
    }
  }

  async signup(createUserDto: CreateUserDto) {
    try {
      const email = createUserDto.email;
      const euser = await this.userRepository.findOneBy({ email });
      if (!euser) {
        try {
          const user = await this.userRepository.save(createUserDto);
          if (user) {
            const payload = {
              sub: user.id,
              email: user.email,
              roles:user.roles,
              name:user.name
            };
            return {
              access_token: await this.jwtService.signAsync(payload),
              payload
            };
          }
        } catch (error) {
          throw new HttpException(
            'Internal Sever error.Error may be: invalid input syntax for type date',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new HttpException('Account aleady created!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw error;
    }
  }
  
  async update(updateUserDto: UpdateUserDto, userId: number) {
    try {
      const updatedUser = await this.userRepository.update(
        userId,
        updateUserDto,
      );
      if (updatedUser.affected > 0) {
        return { message: 'User updated successfully' };
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  async findOneforChangePasword(userId: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const {password,...userData}=user
      return user;
    } catch (error) {
      throw error;
    }
  }
  async findOne(userId: number){
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const {password,...userData}=user
      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return user;
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  //Using Async Await
  async delete(userId: number) {
    try {
      const result = await this.userRepository.delete(userId);
      //console.log(result);
      if (result.affected > 0) {
        return { message: 'User deleted successfully' };
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }
}
