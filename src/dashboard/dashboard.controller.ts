import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService:DashboardService){}

    @Get('/analytics')
    analytics(){
        try{
            return this.dashboardService.analytics();
        }catch(error){
            return { message: error.message };
        }
    }
}
