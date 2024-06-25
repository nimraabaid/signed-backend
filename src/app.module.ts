import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizController } from './quiz/quiz.controller';
import { UserController } from './user/user.controller';
import { CourseController } from './course/course.controller';
import { FeedbackController } from './feedback/feedback.controller';
import { PurchaseController } from './purchase/purchase.controller';
import { VideoController } from './video/video.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entity/user.entity';
import { CourseModule } from './course/course.module';
import { Course } from './course/entities/course.entity';
import { UserCourse } from './course/entities/usercourse.entity';
import { ConfigModule } from '@nestjs/config';
import { Video } from './video/enities/video.entity';
import { VideoModule } from './video/video.module';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from './feedback/entities/feedback.entity';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({

  imports: [
    ConfigModule.forRoot()
    ,TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User,Course,UserCourse,Video,Feedback],
    synchronize: true,
    autoLoadEntities:true
  }), AuthModule, UserModule, CourseModule, VideoModule, FeedbackModule, DashboardModule],
  controllers: [AppController, QuizController, UserController, CourseController, FeedbackController, PurchaseController, VideoController, AuthController, DashboardController],
  providers: [AppService]
})
export class AppModule {}
