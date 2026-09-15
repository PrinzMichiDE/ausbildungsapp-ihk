import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppConfig } from '../../config/configuration.js';
import { UsersService } from '../users/users.service.js';
import { AuditService } from '../audit/audit.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { verifyPassword } from '../../common/utils/password.js';
import { verifyTotp } from '../../common/utils/totp.js';
import { LoginDto, MfaVerifyDto, RefreshDto } from './dto/auth.dto.js';

interface TokenPayload {
  id: string;
  email: string;
  roles: Role[];
  abteilungIds: string[];
  azubiId: string | null;
  type: 'access' | 'refresh';
}

interface MfaPendingPayload {
  id: string;
  email: string;
  mfa: true;
  type: 'mfa-pending';
}

interface UserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  passwordHash: string;
  mfaSecret: string | null;
  mfaActive: boolean;
  roles: Array<{ role: Role }>;
  abteilungen: Array<{ id: string }>;
  azubiId: string | null;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly config: AppConfig['jwt'];

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    configService: ConfigService,
  ) {
    this.config = configService.get<AppConfig['jwt']>('jwt') as AppConfig['jwt'];
  }

  async login(dto: LoginDto, ip?: string, userAgent?: string) {
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

  async verifyMfa(dto: MfaVerifyDto) {
    let payload: MfaPendingPayload;
    try {
      payload = await this.jwtService.verifyAsync<MfaPendingPayload>(
        dto.pendingToken,
      );
    } catch {
      throw new BusinessException(
        ERROR_CODES.TOKEN_INVALID,
        'Ungültiger MFA-Token',
        401,
      );
    }
    if (payload.mfa !== true || payload.type !== 'mfa-pending') {
      throw new BusinessException(
        ERROR_CODES.TOKEN_INVALID,
        'Kein MFA-Token',
        401,
      );
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    if (!user.mfaSecret) {
      throw new BusinessException(
        ERROR_CODES.MFA_NOT_ENABLED,
        'MFA ist nicht aktiviert',
        400,
      );
    }
    if (!verifyTotp(user.mfaSecret, dto.code)) {
      throw new BusinessException(
        ERROR_CODES.MFA_INVALID_CODE,
        'Ungültiger TOTP-Code',
        401,
      );
    }

    return this.buildTokens(user);
  }

  async refresh(dto: RefreshDto) {
    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(dto.refreshToken);
    } catch {
      throw new BusinessException(
        ERROR_CODES.TOKEN_INVALID,
        'Refresh-Token ungültig',
        401,
      );
    }
    if (payload.type !== 'refresh') {
      throw new BusinessException(
        ERROR_CODES.TOKEN_INVALID,
        'Kein Refresh-Token',
        401,
      );
    }

    const user = await this.usersService.findByEmail(payload.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return this.buildTokens(user);
  }

  private mfaPending(user: UserRecord) {
    const pendingToken = this.jwtService.sign(
      { id: user.id, email: user.email, mfa: true, type: 'mfa-pending' },
      { expiresIn: 120 },
    );
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

  private invalidCredentials(): BusinessException {
    return new BusinessException(
      ERROR_CODES.INVALID_CREDENTIALS,
      'E-Mail oder Passwort falsch',
      401,
    );
  }

  private async logFailedLogin(
    email: string,
    ip?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.auditService.create(
        { id: 'system', email, roles: [], abteilungIds: [], azubiId: null },
        {
          action: 'LOGIN_FAILED',
          entity: 'auth',
          details: `Fehlgeschlagener Login-Versuch für E-Mail: ${email}`,
          ipAddress: ip,
          userAgent,
        },
      );
    } catch (error) {
      this.logger.warn('Audit-Logging für fehlgeschlagenen Login fehlgeschlagen', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private buildTokens(user: UserRecord) {
    const roles = user.roles.map((r) => r.role);
    const abteilungIds = user.abteilungen.map((a) => a.id);

    const base: Omit<TokenPayload, 'type'> = {
      id: user.id,
      email: user.email,
      roles,
      abteilungIds,
      azubiId: user.azubiId,
    };

    const accessToken = this.jwtService.sign(
      { ...base, type: 'access' },
      { expiresIn: this.config.accessExpiresIn as unknown as number },
    );
    const refreshToken = this.jwtService.sign(
      { ...base, type: 'refresh' },
      { expiresIn: this.config.refreshExpiresIn as unknown as number },
    );

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
}
