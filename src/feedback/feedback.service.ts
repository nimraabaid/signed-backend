import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dto/feedback-create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import {
  EntityManager,
  QueryFailedError,
  Repository,
  getManager,
} from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entity/user.entity';
import { UpdateFeedbackDto } from './dto/feedback-update.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async postFeedback(createfeedbackdto: CreateFeedbackDto) {
    try {
      const user = await this.userRepository.findOneBy({
        id: Number(createfeedbackdto.user),
      });
      const course = await this.courseRepository.findOneBy({
        id: Number(createfeedbackdto.course),
      });

      if (!user) {
        throw new HttpException('Invalid User', HttpStatus.NOT_FOUND);
      } else if (!course) {
        throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
      } else {
        return await this.feedbackRepository.manager.transaction(
          async (transactionalEntityManager: EntityManager) => {
            try {
              const feedback = transactionalEntityManager.create(
                Feedback,
                createfeedbackdto,
              );
              await transactionalEntityManager.save(feedback);

              await this.updateCourseOverallRating(
                Number(createfeedbackdto.course),
                transactionalEntityManager,
              );

              return feedback;
            } catch (error) {
              if (
                error instanceof QueryFailedError &&
                error.message.includes('duplicate key')
              ) {
                throw new ConflictException(
                  'Please edit your previous feedback. Only one feedback per course is allowed.',
                );
              }
              throw error;
            }
          },
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // async postFeedback(createfeedbackdto: CreateFeedbackDto) {
  //   try {
  //     const user = await this.userRepository.findOneBy({
  //       id: Number(createfeedbackdto.user),
  //     });
  //     const course = await this.courseRepository.findOneBy({
  //       id: Number(createfeedbackdto.course),
  //     });
  //     if (!user) {
  //       throw new HttpException('Invalid User', HttpStatus.NOT_FOUND);
  //     } else if (!course) {
  //       throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
  //     } else {
  //       try {
  //         const feedback =await this.feedbackRepository.save(createfeedbackdto);
  //         return feedback;
  //       } catch (error) {
  //         if (
  //           error instanceof QueryFailedError &&
  //           error.message.includes('duplicate key')
  //         ) {
  //           throw new ConflictException(
  //             'Please edit your previous feedback. Only one feedback per course is allowed.',
  //           );
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async updateFeedback(id: number, updateFeedBackDto: UpdateFeedbackDto) {
    try {
      const updatedCourse = await this.feedbackRepository.update(
        id,
        updateFeedBackDto,
      );
      if (updatedCourse.affected > 0) {
        return { message: 'Feedback updated successfully' };
      } else {
        throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
  }

  async getAllFeedbacks() {
    try {
      const courses = await this.feedbackRepository.find({
        order: {
          id: 'ASC',
        },
      });
      if (courses.length == 0) {
        throw new HttpException('Feedbacks not found', HttpStatus.NOT_FOUND);
      }
      return courses;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.feedbackRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const feedback = await transactionalEntityManager.query(`select * from feedback where id=$1`,[id])
          if (!feedback || feedback.length===0) {
            throw new HttpException('Feedback not found', HttpStatus.NOT_FOUND);
          }
          const courseId = feedback[0].CourseId;
          // Delete the feedback
          const deletedFeedback = await transactionalEntityManager.delete(
            Feedback,
            id,
          );
          if (deletedFeedback.affected > 0) {
            // Recalculate the overall rating for the course within the same transaction
            await this.updateCourseOverallRating(
              courseId,
              transactionalEntityManager,
            );
            return { message: 'Feedback deleted successfully' };
          } else {
            throw new HttpException('Feedback not found to be deleted', HttpStatus.NOT_FOUND);
          }
        },
      );
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }
  async userFeedback(courseId: number, userId: number) {
    try {
      const feedback = await this.feedbackRepository.findOne({
        where: {
          user: { id: userId },
          course: { id: courseId },
        },
        relations: ['user', 'course'],
      });
      if (!feedback) {
        return {};
      }
      return feedback;
    } catch (error) {
      throw error;
    }
  }

  private async updateCourseOverallRating(
    courseId: number,
    transactionalEntityManager: EntityManager,
  ) {
    const avgRating = await transactionalEntityManager
      .createQueryBuilder(Feedback, 'feedback')
      .select('AVG(feedback.rating)', 'avg')
      .where('feedback.CourseId = :courseId', { courseId })
      .getRawOne();

    await transactionalEntityManager.update(Course, courseId, {
      overall_rating: avgRating.avg,
    });
  }
}
