import { Exclude, Expose } from 'class-transformer';
import { AttendanceStatus } from 'src/enums/AttendanceStatus';

@Exclude()
export class AttendanceDto {
  @Expose()
  readonly studentId: number;

  @Expose()
  readonly courseId: number;

  @Expose()
  readonly enrolmentId: number;

  @Expose()
  readonly date: Date;

  @Expose()
  readonly status: AttendanceStatus;
}