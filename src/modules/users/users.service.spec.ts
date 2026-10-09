import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AuditService } from '../audit/audit.service.js';
import { UsersService } from './users.service.js';
import { Role } from '../../common/constants/roles.js';
import { hashPassword } from '../../common/utils/password.js';
import * as totpUtils from '../../common/utils/totp.js';

vi.mock('../../common/utils/password.js', () => ({
  hashPassword: vi.fn(),
}));

vi.mock('../../common/utils/totp.js', () => ({
  generateTotpSecret: vi.fn(),
  verifyTotp: vi.fn(),
  buildOtpauthUrl: vi.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prisma: Record<string, any>;
  let accessScopeService: Record<string, any>;
  let auditService: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
      },
      userRoles: {
        deleteMany: vi.fn(),
        create: vi.fn(),
      },
    };

    accessScopeService = {
      getVisibleAzubiIds: vi.fn(),
    };

    auditService = {
      log: vi.fn(),
    };

    vi.mocked(hashPassword).mockResolvedValue('hashed_password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prisma },
        { provide: AccessScopeService, useValue: accessScopeService },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  describe('create', () => {
    it('erstellt einen Benutzer mit Rollen und loggt den Audit-Event', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'Test',
        lastName: 'User',
        roles: [Role.azubi],
      };

      vi.mocked(hashPassword).mockResolvedValue('hashed_abc');
      prisma.user.create.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        passwordHash: 'hashed_abc',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.create(createUserDto);

      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'test@example.com',
          }),
        }),
      );
      expect(auditService.log).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('gibt alle Benutzer zurück wenn admin', async () => {
      const currentUser = {
        id: 'usr-admin',
        email: 'admin@example.com',
        roles: [Role.admin],
      } as any;

      prisma.user.findMany.mockResolvedValue([
        {
          id: 'usr-1',
          email: 'a@example.com',
          firstName: 'A',
          lastName: 'B',
          passwordHash: 'hash',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any);

      const result = await service.findAll(currentUser);

      expect(Array.isArray(result)).toBe(true);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('gibt einen Benutzer anhand seiner ID zurück', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.findOne('usr-1', currentUser);

      expect(result.id).toBe('usr-1');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
      });
    });

    it('wirft NotFoundException wenn Benutzer nicht gefunden', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('usr-nonexistent', currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('aktualisiert einen Benutzer', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.admin],
      } as any;

      const updateDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      prisma.user.update.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'Name',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.update('usr-1', updateDto, currentUser);

      expect(result.firstName).toBe('Updated');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'usr-1' },
        }),
      );
    });
  });

  describe('remove', () => {
    it('löscht einen Benutzer', async () => {
      const currentUser = {
        id: 'usr-admin',
        email: 'admin@example.com',
        roles: [Role.admin],
      } as any;

      prisma.user.delete.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
      } as any);

      const result = await service.remove('usr-1', currentUser);

      expect(result.id).toBe('usr-1');
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: 'usr-1' },
      });
    });
  });

  describe('enableMFA', () => {
    it('generiert einen TOTP-Secret für den Benutzer', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      const mockSecret = 'JBSWY3DPEHPK3PXP';
      vi.mocked(totpUtils.generateTOTP).mockResolvedValue({
        secret: mockSecret,
        otpAuthUrl: 'otpauth://...',
      });

      prisma.user.update.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        mfaSecret: mockSecret,
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.enableMFA('usr-1', currentUser);

      expect(result.secret).toBe(mockSecret);
      expect(totpUtils.generateTOTP).toHaveBeenCalledWith('test@example.com');
    });

    it('wirft NotFoundException wenn Benutzer nicht existiert', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      vi.mocked(totpUtils.generateTOTP).mockResolvedValue({
        secret: 'secret',
        otpAuthUrl: 'otpauth://...',
      });

      prisma.user.update.mockRejectedValue(new Error('Record not found'));

      await expect(service.enableMFA('usr-nonexistent', currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('verifyMfa', () => {
    it('aktiviert MFA wenn der Code valide ist', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      vi.mocked(totpUtils.verifyTOTP).mockResolvedValue(true);
      prisma.user.update.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        mfaEnabled: true,
        mfaSecret: 'secret',
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.verifyMfa('usr-1', { code: '123456' }, currentUser);

      expect(result.mfaEnabled).toBe(true);
    });

    it('wirft BadRequestException wenn Code ungültig', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      vi.mocked(totpUtils.verifyTOTP).mockResolvedValue(false);

      await expect(
        service.verifyMfa('usr-1', { code: '000000' }, currentUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('disableMfa', () => {
    it('deaktiviert MFA für einen Benutzer', async () => {
      const currentUser = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.azubi],
      } as any;

      prisma.user.update.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        mfaEnabled: false,
        mfaSecret: null,
        passwordHash: 'hash',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.disableMfa('usr-1', currentUser);

      expect(result.mfaEnabled).toBe(false);
    });
  });
});