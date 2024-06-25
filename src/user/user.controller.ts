import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from './dto/user-create.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Public } from 'src/auth/auth.controller';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guards';
//   import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@UseGuards(AuthGuard,RolesGuard)
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  //Get All User
  // @UseGuards(JwtAuthGuard)
  
  @Get()
  getUsers() {
    return this.userService.get();
  }

  @Public()
  //Post user
  @Post()
  store(@Body() createUserDto: CreateUserDto) {
    try{
    return this.userService.createUser(createUserDto);
    }catch(error){
      return { message: error.message };
    }
  }
  @Public()
  //Sign up user
  @Post("/signup")
  signup(@Body() createUserDto: CreateUserDto) {
    try{
    return this.userService.signup(createUserDto);
    }catch(error){
      return { message: error.message };
    }
  }

  //Update user
  @Patch('/:id')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.userService.update(updateUserDto, id);
  }

  //Get One User
  
  //@Roles(Role.STUDENT)
  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  //Delete User
  @Delete('/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = this.userService.delete(id);
      return result;
    } catch (error) {
      return { message: error.message };
    }
  }
}
