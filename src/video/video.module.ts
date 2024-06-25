import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './enities/video.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
    controllers:[VideoController],
    providers:[VideoService],
    exports:[VideoService],
    imports:[TypeOrmModule.forFeature([Video,Course])]
})
export class VideoModule {

}
