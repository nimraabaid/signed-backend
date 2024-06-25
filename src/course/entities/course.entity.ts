import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserCourse } from './usercourse.entity';
import { Video } from 'src/video/enities/video.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';

export enum CourseType {
  Paid = 'paid',
  Free = 'free',
}

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column({default:'0.00'})
  price: string;

  @Column()
  createdBy: string;

  @Column({
    type: 'enum',
    enum: CourseType,
    default: CourseType.Free,
  })
  type: CourseType;

  @Column({ type: 'float', default: 0 })
  overall_rating: number;

  //Course Relation with User via 3rd Table (UserCourse)
  @OneToMany(() => UserCourse, (usercourse) => usercourse.course, {
    onDelete: 'CASCADE',
  })
  userCourses: UserCourse[];

  //Course Relation with Video
  @OneToMany(() => Video, (video) => video.course, { onDelete: 'CASCADE' })
  videos: Video[];

  //Course Relation with Feedback
  @OneToMany(() => Feedback, (feedback) => feedback.course, { onDelete: 'CASCADE' })
  feedback: Feedback[];
}
