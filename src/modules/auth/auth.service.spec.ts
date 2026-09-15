import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { AuditService } from '../audit/audit.service.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import * as passwordUtils from '../../common/utils/password.js';
import * as totpUtils from '../../common/utils/totp.js';

vi.mock('../../common/utils/password.js', () => ({
  verifyPassword: vi.fn(),
}));

vi.mock('../../common/utils/totp.js', () => ({
  verifyTotp: vi.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    findByEmail: ReturnType<typeof vi.fn>;
  };
  let jwtService: {
    sign: ReturnType<typeof vi.fn>;
    verifyAsync: ReturnType<typeof vi.fn>;
  };
  let auditService: {
    create: ReturnType<typeof vi.fn>;
  };

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Max',
    lastName: 'Mustermann',
    isActive: true,
    passwordHash: '$2b$12$hashedpassword',
    mfaSecret: null,
    mfaActive: false,
    roles: [{ role: 'azubi' as const }],
    abteilungen: [{ id: 'abt-1' }],
    azubiId: 'azubi-1',
  };

  beforeEach(async () => {
    usersService = { findByEmail: vi.fn() };
    jwtService = { sign: vi.fn(), verifyAsync: vi.fn() };
    auditService = { create: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: AuditService, useValue: auditService },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue({
              secret: 'test-secret',
              accessExpiresIn: '15m',
              refreshExpiresIn: '7d',
            }),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('login', () => {
    it('gibt Tokens zurück bei gültigen Zugangsdaten', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      vi.mocked(passwordUtils.verifyPassword).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mock-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock-token');
      expect(result.refreshToken).toBe('mock-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('wirft UnauthorizedException bei ungültigem Passwort', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      vi.mocked(passwordUtils.verifyPassword).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(BusinessException);
    });

    it('wirft UnauthorizedException wenn User nicht existiert', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'pass' }),
      ).rejects.toThrow(BusinessException);
    });

    it('wirft UnauthorizedException wenn User inaktiv', async () => {
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        isActive: false,
      });

      await expect(
        service.login({ email: 'test@example.com', password: 'pass' }),
      ).rejects.toThrow(BusinessException);
    });

    it('gibt mfaRequired zurück wenn MFA aktiv', async () => {
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        mfaActive: true,
      });
      vi.mocked(passwordUtils.verifyPassword).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('mfa-pending-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.mfaRequired).toBe(true);
      expect(result.pendingToken).toBe('mfa-pending-token');
    });

    it('loggt fehlgeschlagenen Login im Audit', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await service
        .login({ email: 'test@example.com', password: 'wrong' })
        .catch(() => {});

      expect(auditService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
        expect.objectContaining({ action: 'LOGIN_FAILED' }),
      );
    });
  });

  describe('verifyMfa', () => {
    it('gibt Tokens zurück bei gültigem TOTP-Code', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        mfa: true,
        type: 'mfa-pending',
      });
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        mfaSecret: 'SECRET',
        mfaActive: true,
      });
      vi.mocked(totpUtils.verifyTotp).mockReturnValue(true);
      jwtService.sign.mockReturnValue('final-token');

      const result = await service.verifyMfa({
        pendingToken: 'valid-pending',
        code: '123456',
      });

      expect(result.accessToken).toBe('final-token');
    });

    it('wirft Fehler bei ungültigem Pending-Token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('invalid'));

      await expect(
        service.verifyMfa({ pendingToken: 'invalid', code: '123456' }),
      ).rejects.toThrow(BusinessException);
    });

    it('wirft Fehler bei ungültigem TOTP-Code', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        mfa: true,
        type: 'mfa-pending',
      });
      usersService.findByEmail.mockResolvedValue({
        ...mockUser,
        mfaSecret: 'SECRET',
        mfaActive: true,
      });
      vi.mocked(totpUtils.verifyTotp).mockReturnValue(false);

      await expect(
        service.verifyMfa({ pendingToken: 'valid', code: '000000' }),
      ).rejects.toThrow(BusinessException);
    });
  });

  describe('refresh', () => {
    it('gibt neue Tokens bei gültigem Refresh-Token', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        type: 'refresh',
      });
      usersService.findByEmail.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('new-token');

      const result = await service.refresh({
        refreshToken: 'valid-refresh',
      });

      expect(result.accessToken).toBe('new-token');
    });

    it('wirft Fehler bei ungültigem Refresh-Token', async () => {
      jwtService.verifyAsync.mockRejectedValue(new Error('expired'));

      await expect(
        service.refresh({ refreshToken: 'expired' }),
      ).rejects.toThrow(BusinessException);
    });

    it('wirft Fehler bei Access-Token statt Refresh-Token', async () => {
      jwtService.verifyAsync.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        type: 'access',
      });

      await expect(
        service.refresh({ refreshToken: 'access-token' }),
      ).rejects.toThrow(BusinessException);
    });
  });
});
