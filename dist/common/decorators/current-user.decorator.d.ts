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
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
