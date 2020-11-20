import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from 'src/service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = request.get('Authorization').split(" ", 2)[1];
    return this.authService.verifyToken(token);
  }
}