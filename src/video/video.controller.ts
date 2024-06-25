import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoService } from './video.service';
import { UpdateVideoDto } from './dto/update-video.dto';

@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post()
  uploadVideo(@Body() createVideoDto: CreateVideoDto) {
    try {
      return this.videoService.uploadvideo(createVideoDto);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get()
  findAllVideos() {
    try {
      return this.videoService.findVideos();
    } catch (error) {
      return { message: error.message };
    }
  }

  @Get(':id')
  findVideoById(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.videoService.findVideoById(id);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Patch()
  updateVideo(
    @Body() updateVideoDto: UpdateVideoDto[],
  ) {
    try {
      return this.videoService.updateVideo(updateVideoDto);
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete(':id')
  deleteCourse(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.videoService.delete(id);
    } catch (error) {
      return this.videoService.delete(id);
    }
  }
}
