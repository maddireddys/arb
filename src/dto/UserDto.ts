import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly type: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly mobile: string;

  @Exclude()
  readonly pwd: string;
}
