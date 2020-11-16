import { Exclude, Expose } from 'class-transformer';
import { AttendanceStatus } from 'src/enums/AttendanceStatus';

@Exclude()
export class AttendanceDetails {
  @Expose()
  courseName: string;

  @Expose()
  courseId: number;

  @Expose()
  date: Date;

  @Expose()
  status: AttendanceStatus;
}