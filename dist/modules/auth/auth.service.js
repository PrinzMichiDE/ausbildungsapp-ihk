var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { AuditService } from '../audit/audit.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { verifyPassword } from '../../common/utils/password.js';
import { verifyTotp } from '../../common/utils/totp.js';
let AuthService = AuthService_1 = class AuthService {
    usersService;
    jwtService;
    auditService;
    logger = new Logger(AuthService_1.name);
    config;
    constructor(usersService, jwtService, auditService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.config = configService.get('jwt');
    }
    async login(dto, ip, userAgent) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user || !user.isActive) {
            await this.logFailedLogin(dto.email, ip, userAgent);
            throw this.invalidCredentials();
        }
        const valid = await verifyPassword(dto.password, user.passwordHash);
        if (!valid) {
            await this.logFailedLogin(dto.email, ip, userAgent);
            throw this.invalidCredentials();
        }
        if (user.mfaActive) {
            return this.mfaPending(user);
        }
        return this.buildTokens(user);
    }
    async verifyMfa(dto) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.pendingToken);
        }
        catch {
            throw new BusinessException(ERROR_CODES.TOKEN_INVALID, 'Ungültiger MFA-Token', 401);
        }
        if (payload.mfa !== true || payload.type !== 'mfa-pending') {
            throw new BusinessException(ERROR_CODES.TOKEN_INVALID, 'Kein MFA-Token', 401);
        }
        const user = await this.usersService.findByEmail(payload.email);
        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }
        if (!user.mfaSecret) {
            throw new BusinessException(ERROR_CODES.MFA_NOT_ENABLED, 'MFA ist nicht aktiviert', 400);
        }
        if (!verifyTotp(user.mfaSecret, dto.code)) {
            throw new BusinessException(ERROR_CODES.MFA_INVALID_CODE, 'Ungültiger TOTP-Code', 401);
        }
        return this.buildTokens(user);
    }
    async refresh(dto) {
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(dto.refreshToken);
        }
        catch {
            throw new BusinessException(ERROR_CODES.TOKEN_INVALID, 'Refresh-Token ungültig', 401);
        }
        if (payload.type !== 'refresh') {
            throw new BusinessException(ERROR_CODES.TOKEN_INVALID, 'Kein Refresh-Token', 401);
        }
        const user = await this.usersService.findByEmail(payload.email);
        if (!user || !user.isActive) {
            throw new UnauthorizedException();
        }
        return this.buildTokens(user);
    }
    mfaPending(user) {
        const pendingToken = this.jwtService.sign({ id: user.id, email: user.email, mfa: true, type: 'mfa-pending' }, { expiresIn: 120 });
        return {
            mfaRequired: true,
            pendingToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }
    invalidCredentials() {
        return new BusinessException(ERROR_CODES.INVALID_CREDENTIALS, 'E-Mail oder Passwort falsch', 401);
    }
    async logFailedLogin(email, ip, userAgent) {
        try {
            await this.auditService.create({ id: 'system', email, roles: [], abteilungIds: [], azubiId: null }, {
                action: 'LOGIN_FAILED',
                entity: 'auth',
                details: `Fehlgeschlagener Login-Versuch für E-Mail: ${email}`,
                ipAddress: ip,
                userAgent,
            });
        }
        catch (error) {
            this.logger.warn('Audit-Logging für fehlgeschlagenen Login fehlgeschlagen', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    buildTokens(user) {
        const roles = user.roles.map((r) => r.role);
        const abteilungIds = user.abteilungen.map((a) => a.id);
        const base = {
            id: user.id,
            email: user.email,
            roles,
            abteilungIds,
            azubiId: user.azubiId,
        };
        const accessToken = this.jwtService.sign({ ...base, type: 'access' }, { expiresIn: this.config.accessExpiresIn });
        const refreshToken = this.jwtService.sign({ ...base, type: 'refresh' }, { expiresIn: this.config.refreshExpiresIn });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles,
                abteilungIds,
            },
        };
    }
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService,
        AuditService,
        ConfigService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map