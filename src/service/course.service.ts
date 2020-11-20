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
import { JsonSocket } from '@nestjs/microservices';
import { StudentCourseResp } from 'src/dto/StudentCourseResp';
import { EnrolmentsResp } from 'src/dto/EnrolmentsResp';

@Injectable()
export class CourseService {
    constructor(private readonly userService: UserService) {
	}
	async addCourse(courseDto: CourseDto): Promise<ResponseDto> {
		let resp = new ResponseDto();
        resp.status = RespStatus.FAILED;
        const course = plainToClass(Course, courseDto);
        let user = this.userService.findById(courseDto.userId);
        if(!user) {
            throw new NotFoundException("User rec not found for id:"+courseDto.userId)
        }
        course.user = await user;
		return await getManager().transaction(async transactionalEntityManager => {
			let savedObj =  await transactionalEntityManager.save(course);
			resp.status = RespStatus.SUCCESS;
			resp.data = savedObj;
			return resp;
		});
    }
    
    async enrolCourse(enrolmentDto: EnrolmentDto): Promise<ResponseDto> {
		let resp = new ResponseDto();
        resp.status = RespStatus.FAILED;
        
		return await getManager().transaction(async transactionalEntityManager => {
            const data: any = [];
            const course = await this.findById(enrolmentDto.courseId);
            const student = await this.userService.findById(enrolmentDto.studentId);
            let enrolment = new Enrolment();
            enrolment.course = course;
            enrolment.student = student;
            enrolment = await transactionalEntityManager.save(enrolment);
            data.push(enrolment);
            resp.status = RespStatus.SUCCESS;
			resp.data = data;
			return resp;
        });
    }

    async loadCourseEnrolments(courseId: number): Promise<ResponseDto> {
		let resp = new ResponseDto();
        resp.status = RespStatus.FAILED;
        const enrolments = await getManager().createQueryBuilder(Enrolment, 'enrolment')
        .leftJoinAndSelect("enrolment.course", "course")
        .leftJoinAndSelect('enrolment.student', 'user')
        .where("course.id = :id", { id: courseId })
        .getMany();
        const enrolment_resp : any =  [];
        await enrolments.forEach(element => {
            let enrolmentsResp = new EnrolmentsResp();
            enrolmentsResp.id = element.id;
            enrolmentsResp.name = element.student.firstName+' '+ element.student.lastName;
            enrolmentsResp.studentId = element.student.id;
            enrolmentsResp.courseId = element.course.id;
            enrolment_resp.push(enrolmentsResp);
        });
        resp.status = RespStatus.SUCCESS;
		resp.data = enrolment_resp;
		return resp;
    }

	async findById(id: number): Promise<Course> {
		let courseRepository = getConnection().getRepository(Course);
		return await courseRepository.findOneOrFail(id);
    }

    async findOne(name: string): Promise<Course> {
		let courseRepository = getConnection().getRepository(Course);
		return await courseRepository.findOneOrFail({ name: name });
    }

    async findEnrolment(id: number): Promise<Enrolment> {
		let courseRepository = getConnection().getRepository(Enrolment);
		return await courseRepository.findOneOrFail({ id: id });
    }

    async findCourses(user_id: number): Promise<ResponseDto> {
        let resp = new ResponseDto();
        resp.status = RespStatus.SUCCESS;
		resp.data = await getManager().createQueryBuilder(Course, 'course')
        .leftJoinAndSelect("course.user", "user")
        .where("user.id = :id", { id: user_id })
        .getMany();
        return resp;
    }

    async findStudentCourses(student_id: number): Promise<ResponseDto> {
        let resp = new ResponseDto(); 
        resp.status = RespStatus.SUCCESS;
        let entities = await getManager().find(Course);
        const courses : any =  [];
        if(entities) {
            
             for(let entity of entities) {  
                let studentEnrolment = await getManager().createQueryBuilder(Enrolment, 'enrolment')
                .leftJoinAndSelect("enrolment.course", "course")
                .leftJoinAndSelect("enrolment.student", "student")
                .where("course.id = :id", { id: entity.id })
                .andWhere("student.id=:studentId", {studentId : student_id})
                .getMany();
                let enrolled = false;
                if(studentEnrolment && studentEnrolment.length >0) {
                    enrolled = true;
                }
                const studentCourseResp = plainToClass(StudentCourseResp, entity);
                studentCourseResp.enrolled = enrolled;
                courses.push(studentCourseResp);
                          
            }
        }
		resp.data = courses;
        return resp;
    }
}
