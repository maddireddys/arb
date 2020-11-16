import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto } from 'src/dto/ResponseDto';
import { RespStatus } from 'src/enums/RespStatus';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let resp = new ResponseDto();
    resp.status = RespStatus.FAILED;
    resp.data = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url
      };
    response.status(status).json(JSON.stringify(resp));
  }
}
