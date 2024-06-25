import { Course } from "src/course/entities/course.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class Video{
    @PrimaryGeneratedColumn()
    id:number

    @Column({default:null})
    title:string

    @Column()
    videoUrl:string

    @ManyToOne(()=>Course,course=>course.videos,{ onDelete: 'CASCADE' })
    @JoinColumn({name:"courseId"})
    course:Course;
}