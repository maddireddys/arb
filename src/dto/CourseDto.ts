import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CourseDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly name: string;

  @Expose()
  readonly userId: number;
}
