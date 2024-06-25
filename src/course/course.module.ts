import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

import { UserCourse } from './entities/usercourse.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entity/user.entity';
import { Video } from 'src/video/enities/video.entity';

@Module({
    controllers:[CourseController],
    providers:[CourseService],
    exports:[CourseService],
    imports:[TypeOrmModule.forFeature([Course,UserCourse,User,Video])]
})
export class CourseModule {
}
