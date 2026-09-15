import { AuthService } from './auth.service.js';
import { LoginDto, MfaVerifyDto, RefreshDto } from './dto/auth.dto.js';
import type { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto, req: Request): Promise<{
        mfaRequired: boolean;
        pendingToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } | {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: import("@prisma/client").$Enums.Role[];
            abteilungIds: string[];
        };
    }>;
    verifyMfa(dto: MfaVerifyDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: import("@prisma/client").$Enums.Role[];
            abteilungIds: string[];
        };
    }>;
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: import("@prisma/client").$Enums.Role[];
            abteilungIds: string[];
        };
    }>;
}
