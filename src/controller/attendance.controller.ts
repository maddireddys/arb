import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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
    return await this.attendanceService.addAttendance(attendanceDto);
  }

  @Get('/load/:courseId/:studentId')
  @UseGuards(AuthGuard)
  async loadAttendance(@Param() params): Promise<ResponseDto> {
    return await this.attendanceService.loadStudentAttendance(params.studentId, params.courseId);
  }
}
