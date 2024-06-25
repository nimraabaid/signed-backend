import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
    controllers:[DashboardController],
    providers:[DashboardService],
    exports:[DashboardService],
    imports:[TypeOrmModule.forFeature([Course,User])]
})
export class DashboardModule {}
