import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseDto } from 'src/dto/CourseDto';
import {getManager, getConnection} from "typeorm";

import { plainToClass } from 'class-transformer';
import { ResponseDto } from 'src/dto/ResponseDto';
import { RespStatus } from 'src/enums/RespStatus';
import { Course } from 'src/entity/Course';
import { UserService } from './user.service';
import { EnrolmentDto } from 'src/dto/EnrolmentDto';
import { Enrolment } from 'src/entity/Enrolment';
import { CourseService } from './course.service';
import { AttendanceDto } from 'src/dto/AttendanceDto';
import { Attendance } from 'src/entity/Attendance';
import { AttendanceDetails } from 'src/dto/AttendanceDetails';
import { AttendanceResp } from 'src/dto/AttendanceResp';

@Injectable()
export class AttendanceService {
    constructor(private readonly userService: UserService,
        private readonly courseService: CourseService) {
	}
	async addAttendance(attendanceDtos: any): Promise<ResponseDto> {
		let resp = new ResponseDto();
        resp.status = RespStatus.FAILED;
        const dtos = Array.from(attendanceDtos);
        return await getManager().transaction(async transactionalEntityManager => {
            const data: any = [];
            await dtos.forEach(async element => {
                const attendanceDto = plainToClass(AttendanceDto, element);
                const user = await this.userService.findById(attendanceDto.studentId);
                const course = await this.courseService.findById(attendanceDto.courseId);
                const enrolment = await this.courseService.findEnrolment(attendanceDto.enrolmentId);
                const attendance = new Attendance();
                attendance.status = attendanceDto.status;
                attendance.course = course;
                attendance.student = user;
                attendance.enrolment = enrolment;
                attendance.date = attendanceDto.date;
                data.push(enrolment);
            });
            resp.status = RespStatus.SUCCESS;
			resp.data = data;
			return resp;
        });
    }

    async loadStudentAttendance(studentId: number, from: Date, to:Date): Promise<ResponseDto> {
		let resp = new ResponseDto();
        resp.status = RespStatus.FAILED;
        const attendances = await getManager().createQueryBuilder(Attendance, 'attendance')
        .leftJoinAndSelect("attendance.student", "student")
        .where("student.id = :id", { studentId })
        .getMany();
        const enrolment_resp : any =  [];
        let courseMap = new Map();  
        attendances.forEach(element => {
            let courses = courseMap.get(element.course.name);
            let attendanceResp = new AttendanceDetails();
            attendanceResp.date = element.date;
            attendanceResp.courseId = element.course.id;
            attendanceResp.courseName = element.course.name;
            attendanceResp.status = element.status;
            if(courses) {
                courses.push(attendanceResp);
            } else {
                courses = [];
                courseMap.set(element.course.name, courses);
                courses.push(attendanceResp);
            }
        });
        for (let entry of courseMap.entries()) {  
            let attendanceRep = new AttendanceResp();
            attendanceRep.courseName = entry[0];
            attendanceRep.details = entry[1];   
            enrolment_resp.push(attendanceRep); 
        }  
        resp.status = RespStatus.SUCCESS;
		resp.data = enrolment_resp;
		return resp;
    }
    
    
	async findById(id: number): Promise<Course> {
		let userRepository = getConnection().getRepository(Course);
		return await userRepository.findOneOrFail(id);
    }

    async findOne(name: string): Promise<Course> {
		let userRepository = getConnection().getRepository(Course);
		return await userRepository.findOne({ name: name });
    }

    async findCourses(user_id: number): Promise<ResponseDto> {
        let resp = new ResponseDto();
        resp.status = RespStatus.SUCCESS;
		resp.data = await getManager().createQueryBuilder(Course, 'course')
        .leftJoinAndSelect("course.user", "user")
        .where("user.id = :id", { user_id })
        .getMany();
        return resp;
    }
}
