import { Module, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { User } from './entity/User';
import * as redisStore from 'cache-manager-redis-store';
import { LoginController } from './controller/login.controller';
import { AuthService } from './service/auth.service';
import { StudentService } from './service/student.service';
import { JwtModule } from '@nestjs/jwt';
import { CourseController } from './controller/course.controller';
import { CourseService } from './service/course.service';
import { Course } from './entity/Course';
import { Enrolment } from './entity/Enrolment';
import { Attendance } from './entity/Attendance';
import { AttendanceController } from './controller/attendance.controller';
import { AttendanceService } from './service/attendance.service';

@Module({
  imports: [
  	TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Tppnm@123',
      database: 'toothsi_cc',
      entities: [User,Course,Enrolment,Attendance],
      synchronize: true,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    JwtModule.register({
      secret: 'd01fab656947414c8a6686c2c5fb9329',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [LoginController, UserController, CourseController, AttendanceController],
  providers: [AuthService, UserService, StudentService, CourseService, AttendanceService],
})
export class AppModule {}
