import { Exclude, Expose } from 'class-transformer';
import { AttendanceStatus } from 'src/enums/AttendanceStatus';
import { AttendanceDetails } from './AttendanceDetails';

@Exclude()
export class AttendanceResp {
  @Expose()
  courseName: string;

  @Expose()
  details: AttendanceDetails[];
}