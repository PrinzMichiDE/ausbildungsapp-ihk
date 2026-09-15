import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../constants/roles.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { PUBLIC_KEY } from '../decorators/public.decorator.js';
import { CurrentUser } from '../decorators/current-user.type.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRoles = this.reflector.getAllAndOverride<ReadonlyArray<Role>>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const user = context.switchToHttp().getRequest<{ user: CurrentUser }>().user;
    if (!user || !user.roles) {
      throw new ForbiddenException({
        errorCode: 'ACCESS_DENIED',
        message: 'Zugriff verweigert',
      });
    }

    const hasRole = requiredRoles.some((role) => user.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException({
        errorCode: 'ACCESS_DENIED',
        message: 'Zugriff verweigert',
      });
    }

    return true;
  }
}
