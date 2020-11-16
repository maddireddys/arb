import { Exclude, Expose } from 'class-transformer';
import { RespStatus } from 'src/enums/RespStatus';

@Exclude()
export class ResponseDto {
    @Expose()
    status: RespStatus;

    @Expose()
    data: any;
}
