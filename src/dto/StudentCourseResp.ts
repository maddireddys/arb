import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class StudentCourseResp {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  enrolled: boolean;
}
