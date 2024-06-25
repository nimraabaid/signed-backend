import { User } from "src/user/entity/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Course } from "./course.entity";

@Entity()
@Unique(['user', 'course'])
export class UserCourse{
    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(()=>User,(user)=>user.userCourses,{ onDelete: 'CASCADE' })
    @JoinColumn({name:"UserId"})
    user:User

    @ManyToOne(()=>Course,(course)=>course.userCourses,{ onDelete: 'CASCADE' })
    @JoinColumn({name:"CourseId"})
    course:Course

}