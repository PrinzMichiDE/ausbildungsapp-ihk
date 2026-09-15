import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { AuditService } from '../audit/audit.service.js';
import { LoginDto, MfaVerifyDto, RefreshDto } from './dto/auth.dto.js';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly auditService;
    private readonly logger;
    private readonly config;
    constructor(usersService: UsersService, jwtService: JwtService, auditService: AuditService, configService: ConfigService);
    login(dto: LoginDto, ip?: string, userAgent?: string): Promise<{
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
    private mfaPending;
    private invalidCredentials;
    private logFailedLogin;
    private buildTokens;
}
