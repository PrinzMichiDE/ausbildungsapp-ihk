import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.js';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ReadonlyArray<Role>) =>
  SetMetadata(ROLES_KEY, roles);
