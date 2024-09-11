import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PictureGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const isToken = req.headers.authorization;
    
    if(isToken) {
      try {
        const token = isToken.replace('Bearer ', '')
        const decode = this.jwtService.decode(token);
        req.user = decode.sub;
        return true;
      } catch (error) {
        console.log(error);
      }
    } else {
      return true;
    }
  }
}
