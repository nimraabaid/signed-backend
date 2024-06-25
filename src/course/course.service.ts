import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto, CreateUserCourseDto } from './dto/course-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { EntityManager, Repository } from 'typeorm';
import { UpdateCourseDto } from './dto/course-update.dto';
import { UserCourse } from './entities/usercourse.entity';
import { User } from 'src/user/entity/user.entity';
import { CreateVideoDto } from 'src/video/dto/create-video.dto';
import { Video } from 'src/video/enities/video.entity';
import { create } from 'domain';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(UserCourse)
    private usercourseRepository: Repository<UserCourse>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
  ) {}

  async getCourse() {
    try {
      const courses = await this.courseRepository.find({
        order: {
          id: 'ASC',
        },
      });
      if (courses.length == 0) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    try {
      const courses = await this.courseRepository.save(createCourseDto);
      return courses;
    } catch (error) {
      throw error;
    }
  }

  //Post Course with Videos
  async createCourseWithVideos(createCourseDto: CreateCourseDto) {
    const {
      title,
      description,
      imageUrl,
      price,
      createdBy,
      type,
      videos,
      overall_rating,
    } = createCourseDto;

    try {
      // Use a transaction to ensure atomicity
      return await this.courseRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // Create and save the course
          const course = transactionalEntityManager.create(Course, {
            title,
            description,
            imageUrl,
            price,
            createdBy,
            type,
            overall_rating,
          });
          await transactionalEntityManager.save(course);

          // Create and save the videos associated with this course
          let videoEntities: Video[] = [];
          if (videos && videos.length > 0) {
            videoEntities = videos.map((video) => {
              return transactionalEntityManager.create(Video, {
                title: video.title,
                videoUrl: video.videoUrl,
                course: course,
              });
            });

            await transactionalEntityManager.save(videoEntities);
          }

          return { course, videoEntities };
        },
      );
    } catch (error) {
      throw error;
    }
  }

  async findOne(courseId: number) {
    try {
      const course = await this.courseRepository.findOneBy({ id: courseId });
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      return course;
    } catch (error) {
      throw error;
    }
  }

  async update(coureId: number, updateCourseDto: UpdateCourseDto) {
    try {
      const updatedCourse = await this.courseRepository.update(
        coureId,
        updateCourseDto,
      );
      if (updatedCourse.affected > 0) {
        return { message: 'Course updated successfully' };
      } else {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      const deletedCourse = await this.courseRepository.delete(id);
      if (deletedCourse.affected > 0) {
        return { message: 'Course deleted successfully' };
      } else {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }

  async enrolleUser(createusercourseDto: CreateUserCourseDto) {
    try {
      const userId = createusercourseDto.user;
      console.log(typeof userId);
      const courseId = Number(createusercourseDto.course);
      console.log(courseId);

      const user = await this.userRepository.findOneBy({ id: Number(userId) });
      console.log(user);
      const course = await this.courseRepository.findOneBy({
        id: Number(courseId),
      });
      console.log(course);
      if (!user) {
        throw new HttpException(
          'Please signup to get enrolled in current course.',
          HttpStatus.NOT_FOUND,
        );
      } else if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      } else {
        try {
          const userCourse = new UserCourse();
          userCourse.user = createusercourseDto.user;
          userCourse.course = createusercourseDto.course;
          //Save the userCourse entity
          const course_enrolled_user =
            await this.usercourseRepository.save(userCourse);
          return course_enrolled_user;
        } catch (error) {
          throw new HttpException(
            'Already Enrolled In Course',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async findEnrolledcourse(userId: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException(
          'Please signup to get enrolle in any course',
          HttpStatus.NOT_FOUND,
        );
      }
      const query = `
    SELECT course.id,course.title,course.description,course."imageUrl",course.price,course."createdBy",course."type",course."overall_rating"
    from((user_course
    inner join course on user_course."CourseId"=course.id)
    inner join public.user on user_course."UserId"=public.user.id)
    where public.user.id= $1
    `;
      return this.usercourseRepository.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }

  async findStudentsEnrolledInCourse(coureId: number) {
    try {
      const course = await this.courseRepository.findOneBy({ id: coureId });
      if (!course) {
        throw new HttpException('Course Not Found', HttpStatus.NOT_FOUND);
      }
      const query = `
    SELECT course.id as "CourseId",course.title,public.user.id,public.user.name,public.user.email,public.user.roles
      from((user_course
      inner join course on user_course."CourseId"=course.id)
      inner join public.user on user_course."UserId"=public.user.id)
      where course.id= $1
    `;
      return this.usercourseRepository.query(query, [coureId]);
    } catch (error) {
      throw error;
    }
  }

  //Course Video

  async getCourseVideos(courseId: number) {
    try {
      const course = await this.courseRepository.findOneBy({ id: courseId });
      console.log(course);
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      const videos = await this.courseRepository.findOne({
        where: { id: courseId },
        relations: ['videos'],
      });
      return videos;
    } catch (error) {
      return error.message;
    }
  }

  //Course dashboard
  // async getCourseDashboard(courseId: number): Promise<Course> {
  //   try {
  //     const course = await this.courseRepository.findOneBy({ id: courseId });
  //     if (!course) {
  //       throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
  //     }
  //     const courseDashboard = await this.courseRepository.findOne({
  //       where: { id: courseId },
  //       relations: ['videos', 'feedback'],
  //     });
  //     return courseDashboard;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  async getCourseDashboard(courseId: number): Promise<Course> {
    try {
      const course = await this.courseRepository.findOneBy({ id: courseId });
      if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      }
      const courseDashboard = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.videos', 'video')
      .leftJoinAndSelect('course.feedback', 'feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .where('course.id = :courseId', { courseId })
      .orderBy('video.id', 'ASC')
      .addOrderBy('feedback.id', 'ASC')
      .getOne();

    if (!courseDashboard) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
      return courseDashboard;
    } catch (error) {
      throw error;
    }
  }

  async enroleMoreCourses(userId:number){
    try{
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException(
          'Please signup to get enrolle in any course',
          HttpStatus.NOT_FOUND,
        );
      }
      const query = `
    SELECT course.id as "id"
    from((user_course
    inner join course on user_course."CourseId"=course.id)
    inner join public.user on user_course."UserId"=public.user.id)
    where public.user.id= $1
    `;
      const usercourses=await this.usercourseRepository.query(query, [userId]);
      // console.log(usercourses)
      const enrolledCourseIds = usercourses.map(userCourse => userCourse.id);
      //console.log(enrolledCourseIds)
      const courses=await this.courseRepository.find()
      
      const moreCourses=courses.filter(course=>!enrolledCourseIds.includes(course.id))
      //console.log(moreCourses)
      return moreCourses;
    }catch(error){
      throw error;
    }
  }
}
