import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/feedback-create.dto';
import { UpdateFeedbackDto } from './dto/feedback-update.dto';

@Controller('feedback')
export class FeedbackController {

    constructor(private feedbackService:FeedbackService){}

    @Post()
    postfeedbck(@Body() createfeedbackdto:CreateFeedbackDto){
        try{
            return this.feedbackService.postFeedback(createfeedbackdto);
        }catch(error){
            return { message: error.message };
        }
    }

    @Get()
    getAllFeedbacks(){
        try{
            return this.feedbackService.getAllFeedbacks();
        }catch(error){
            return { message: error.message };
        }
    }

    @Patch(":id")
    updateFeedBack(@Param() id
        ,@Body() updatefeedbackdto:UpdateFeedbackDto){
        try{
            return this.feedbackService.updateFeedback(id,updatefeedbackdto);
        }catch(error){
            return { message: error.message };
        }
    }

    @Delete(":id")
    delete(@Param('id',ParseIntPipe) id:number){
        try{
            return this.feedbackService.delete(id);
        }catch(error){
            return { message: error.message };
        }
    }

    @Get(":courseId/:userId")
    userFeedback(@Param('courseId',ParseIntPipe)courseId:number,@Param('userId',ParseIntPipe)userId:number ){
        try{
            return this.feedbackService.userFeedback(courseId,userId);
        }catch(error){
            return { message: error.message };
        }
    }
}
