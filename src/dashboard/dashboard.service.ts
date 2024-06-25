import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entity/user.entity';
import { Role } from 'src/user/enums/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {

    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ){}

    async analytics() {
       try{
            const totalCourses=await this.courseRepository.count();
            console.log(totalCourses)
            const totalUsers=await this.userRepository.count()
            console.log(totalUsers)
            const totalStudents=await this.userRepository.count({ where: { roles: Role.STUDENT } });
            const totalAdmins=await this.userRepository.count({ where: { roles: Role.ADMIN } });
            return {totalCourses,totalUsers,totalStudents,totalAdmins}
       }catch(error){
        throw error;
       }
    }
}
