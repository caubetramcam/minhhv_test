import { UserService } from '@app/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CheckTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http: HttpArgumentsHost = context.switchToHttp();
    const request = http.getRequest();
    if (!request.headers.authorization) {
      throw new UnauthorizedException();
    }
    try {
      const accessToken: string = request.headers.authorization.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException();
      }
      const payload = await this.jwtService.verifyAsync(accessToken);
      const user = await this.userService.getProfile(payload?.userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error?.message?.includes('expired')) {
        throw new UnauthorizedException(error?.message);
      }
      throw new ForbiddenException(error?.message);
    }
    return true;
  }
}
