import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/enums/role.enum';
import { ROLES_KEY } from '../roles.decorator';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //console.log(requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    //console.log(request.user);
    const user = request.user;
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}