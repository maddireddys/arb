import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AttendanceDto } from 'src/dto/AttendanceDto';
import { ResponseDto } from 'src/dto/ResponseDto';
import { AuthGuard } from 'src/guard/AuthGuard';
import { AttendanceService } from 'src/service/attendance.service';

@Controller('attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

  @Post('/add')
  @UseGuards(AuthGuard)
  async registerUser(@Body() attendanceDto: AttendanceDto): Promise<ResponseDto> {
    console.log('control add start:'+JSON.stringify(attendanceDto));
    return await this.attendanceService.addAttendance(attendanceDto);
  }
}
