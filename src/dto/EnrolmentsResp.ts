import { Exclude, Expose } from "class-transformer";

@Exclude()
export class EnrolmentsResp {
  @Expose()
  id: number;

  @Expose()
  studentId: number;

  @Expose()
  name: string;

  @Expose()
  courseId: number;
}