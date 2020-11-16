import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CourseDto } from 'src/dto/CourseDto';
import { EnrolmentDto } from 'src/dto/EnrolmentDto';
import { ResponseDto } from 'src/dto/ResponseDto';
import { AuthGuard } from 'src/guard/AuthGuard';
import { CourseService } from 'src/service/course.service';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

  @Post('/add')
  @UseGuards(AuthGuard)
  async registerUser(@Body() courseDto: CourseDto): Promise<ResponseDto> {
    return await this.courseService.addCourse(courseDto);
  }

  @Get('/user/:userId')
  @UseGuards(AuthGuard)
  async getUserCourses(@Param() params): Promise<ResponseDto> {
    return await this.courseService.findCourses(params.userId);
  }

  @Post('/enrol')
  @UseGuards(AuthGuard)
  async enrolCourse(@Body() enrolmentDto: EnrolmentDto): Promise<ResponseDto> {
    return await this.courseService.enrolCourse(enrolmentDto);
  }

  @Get('/student/:studentId')
  @UseGuards(AuthGuard)
  async studentCourses(@Param() params): Promise<ResponseDto> {
    return await this.courseService.findStudentCourses(params.studentId);
  }

  @Get('/enrolments/:courseId')
  @UseGuards(AuthGuard)
  async studentCouloadCourseEnrolmentsrses(@Param() params): Promise<ResponseDto> {
    return await this.courseService.loadCourseEnrolments(params.courseId);
  }
}
