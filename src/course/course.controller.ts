import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request
} from '@nestjs/common';
import { CreateCourseDto, CreateUserCourseDto } from './dto/course-create.dto';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/course-update.dto';
import { VideoService } from 'src/video/video.service';
import { CreateVideoDto } from 'src/video/dto/create-video.dto';

@Controller('/course')
export class CourseController {
  constructor(
    private courseService: CourseService,) 
    {}


  @Get()
  getCourses() {
    return this.courseService.getCourse();
  }

  // @Post()
  // create(@Body() createCourseDto: CreateCourseDto) {
  //   try {
  //     return this.courseService.createCourse(createCourseDto);
  //   } catch (error) {
  //     return { message: error.message };
  //   }
  // }

  // @Post("/videos")
  // createCourseWithVideo(@Body() createCourseDto:CreateCourseDto ,createVideoDto:CreateVideoDto ){
  //   try {
  //     console.log()
  //     return this.courseService.createCourseWithVideos(createCourseDto,createVideoDto);
  //   } catch (error) {
  //     return { message: error.message };
  //   }
  // }

  @Post()
  createCourseWithVideo(@Body() createCourseDto:CreateCourseDto){
    try {
      console.log(createCourseDto)
      return this.courseService.createCourseWithVideos(createCourseDto);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get('/:id')
  getOneCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.delete(id);
  }

  @Post('/enrollecourse')
  enrole(@Body() createusercourseDto: CreateUserCourseDto) {
    return this.courseService.enrolleUser(createusercourseDto);
  }

  
  @Get("/:userId/courses")
  findCourseEnrolledUsers(@Param('userId',ParseIntPipe) userId:number){
    return this.courseService.findEnrolledcourse(userId)
  }

  @Get("/:courseId/users")
  findUsersEnrolledInCourse(@Param('courseId',ParseIntPipe) courseId:number){
    return this.courseService.findStudentsEnrolledInCourse(courseId);
  }

  //Get Course Videos
  @Get(":courseId/videos")
    getCourseVideos(@Param('courseId',ParseIntPipe)courseId:number ){
        try {
            return this.courseService.getCourseVideos(courseId);
          } catch (error) {
            return { message: error.message };
          }
    }

  //Get Course Dashboard
  @Get(":courseId/dashboard")
    getCourseDashoard(@Param('courseId',ParseIntPipe)courseId:number ){
        try {
            return this.courseService.getCourseDashboard(courseId);
          } catch (error) {
            return { message: error.message };
          }
    }
  @Get(":userId/morecourses")
  enroleMoreCourses(@Param('userId',ParseIntPipe)userId:number){
    try {
      return this.courseService.enroleMoreCourses(userId);
    } catch (error) {
      return { message: error.message };
    }

  }
  
}
