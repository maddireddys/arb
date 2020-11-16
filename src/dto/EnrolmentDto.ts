import { Exclude, Expose } from "class-transformer";

@Exclude()
export class EnrolmentDto {

  @Expose()
  readonly studentId: number;

  @Expose()
  readonly courseId: number;
}