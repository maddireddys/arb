import { AttendanceStatus } from 'src/enums/AttendanceStatus';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Course } from './Course';
import { Enrolment } from './Enrolment';
import { User } from './User';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Enrolment)
  enrolment: Enrolment;

  @ManyToOne(() => Course)
  course: Course;

  @ManyToOne(() => User)
  student: User;

  @Column({type: "enum", enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
  status: AttendanceStatus;

  @Column()
  date: Date;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  modifiedDate: Date;
}