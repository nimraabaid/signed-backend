import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './enities/video.entity';
import { Repository } from 'typeorm';
import { Course } from 'src/course/entities/course.entity';
import { UpdateVideoDto } from './dto/update-video.dto';
import { error } from 'console';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private VideoRepository: Repository<Video>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async uploadvideo(createVideoDto: CreateVideoDto) {
    try {
      const video = await this.VideoRepository.save(createVideoDto);
      return video;
    } catch (error) {
      throw new HttpException(
        'Video No must be unique OR Course not availabe. ',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findVideos() {
    try {
      const query = `
      select * from video order by id asc;
      `;
      const videos = await this.VideoRepository.query(query);
      return videos;
    } catch (error) {
      throw new HttpException('Videos Not Found!', HttpStatus.NOT_FOUND);
    }
  }

  async findVideoById(id: number) {
    try {
      const video = await this.VideoRepository.findOneBy({ id: id });
      if (!video) {
        throw new HttpException('Videos Not Found!', HttpStatus.NOT_FOUND);
      }
      return video;
    } catch (error) {
      throw new HttpException('Videos Not Found!', HttpStatus.NOT_FOUND);
    }
  }

  async updateVideo(videoDtos: (UpdateVideoDto | CreateVideoDto)[]) {
    try {
      const processedVideos: Video[] = [];

      for (const videoDto of videoDtos) {
        if ('id' in videoDto && videoDto.id) {
          // Handle update
          const existingVideo = await this.VideoRepository.findOne({
            where: { id: videoDto.id },
          });

          if (existingVideo) {
            Object.assign(existingVideo, videoDto);
            const updatedVideo = await this.VideoRepository.save(existingVideo);
            processedVideos.push(updatedVideo);
          } else {
            throw new NotFoundException(
              `Video with ID ${videoDto.id} not found`,
            );
          }
        } else {
          try {
            // Handle creation
            const newVideo = this.VideoRepository.create(
              videoDto as CreateVideoDto,
            );
            const createdVideo = await this.VideoRepository.save(newVideo);
            processedVideos.push(createdVideo);
          } catch (error) {
            throw new NotFoundException(`Validation Error`);
          }
        }
      }

      return processedVideos;
    } catch (error) {
      throw error;
    }
  }

  // async updateVideo(id: number, updateVideoDto: UpdateVideoDto) {
  //   try {
  //     const updatedVideo = await this.VideoRepository.update(
  //       id,
  //       updateVideoDto,
  //     );
  //     if (updatedVideo.affected > 0) {
  //       return { message: 'Video updated successfully' };
  //     } else {
  //       throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async delete(id: number) {
    try {
      const deletedVideo = await this.VideoRepository.delete(id);
      if (deletedVideo.affected > 0) {
        return { message: 'Video deleted successfully' };
      } else {
        throw new HttpException('Video not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }
}
