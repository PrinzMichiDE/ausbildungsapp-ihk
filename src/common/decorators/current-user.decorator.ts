import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Role } from '../constants/roles.js';

export interface CurrentUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  roles: Role[];
  abteilungIds: string[];
  azubiId: string | null;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
