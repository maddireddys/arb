import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log("request:"+request);
    console.log("header:"+request.get('Authorization'));
    let token = request.get('Authorization').split(" ", 2)[1];
    console.log("token:"+token);
    return this.authService.verifyToken(token);
  }
}