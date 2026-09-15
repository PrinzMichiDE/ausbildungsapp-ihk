import { Role } from '../constants/roles.js';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: ReadonlyArray<Role>) => import("@nestjs/common").CustomDecorator<string>;
