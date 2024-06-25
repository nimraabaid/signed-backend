import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Role } from "../enums/role.enum";
import { Course } from "src/course/entities/course.entity";
import { UserCourse } from "src/course/entities/usercourse.entity";
import { Feedback } from "src/feedback/entities/feedback.entity";

export enum UserStatus{
    Active='active',
    InActive='inactive'
}


@Unique(['email'])
@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column()
    email:string;
    
    @Column()
    password:string;

    @Column({default:"None"})
    imageUrl:string
    @Column({ type: 'date' })
    dob:Date;

    @Column()
    address:string

    @Column()
    mobile:string
    
    @Column({
        type:'enum',
        enum:UserStatus,
        default:UserStatus.Active
    })
    status:UserStatus;

    
    @Column('enum', { enum: Role, nullable: true})
    roles: Role[];

    @OneToMany(()=>UserCourse,usercourse=>usercourse.user,{onDelete:"CASCADE"})
    userCourses:UserCourse[]

    @OneToMany(()=>Feedback,(feedback)=>feedback.user,{onDelete:"CASCADE"})
    feedback:Feedback

}