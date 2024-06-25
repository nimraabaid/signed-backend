import { Course } from "src/course/entities/course.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['user','course'])
export class Feedback{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    comment:string

    @Column()
    rating: number;

    
    @ManyToOne(()=>Course,(course)=>course.feedback,{ onDelete: 'CASCADE' })
    @JoinColumn({name:"CourseId"})
    course:Course

    @ManyToOne(()=>User,(user)=>user.feedback,{ onDelete: 'CASCADE' })
    @JoinColumn({name:"UserId"})
    user:User

}