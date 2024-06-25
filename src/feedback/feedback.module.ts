import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Course } from 'src/course/entities/course.entity';
import { User } from 'src/user/entity/user.entity';

@Module({
  controllers:[FeedbackController],
  providers: [FeedbackService],
  exports:[FeedbackService],
  imports:[TypeOrmModule.forFeature([Feedback,Course,User])]

})
export class FeedbackModule {}
