import { Role } from '../../../common/constants/roles.js';
export declare class CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: Role[];
    abteilungIds?: string[];
}
export declare class UpdateUserDto {
    roles?: Role[];
    abteilungIds?: string[];
    isActive?: boolean;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    roles: Role[];
    abteilungIds: string[] | null;
    mfaActive: boolean;
}
export declare class MfaSecretDto {
    secret: string;
    otpauthUrl: string;
}
export declare class MfaEnableDto {
    code: string;
}
export declare class MfaDisableDto {
    code: string;
}
