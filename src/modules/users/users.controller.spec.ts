import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AuditService } from '../audit/audit.service.js';
import { Role } from '../../common/constants/roles.js';

vi.mock('../../common/utils/password.js', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed'),
}));

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    usersService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      enableMfa: vi.fn(),
      verifyMfa: vi.fn(),
      disableMfa: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: PrismaService, useValue: {} },
        { provide: AccessScopeService, useValue: {} },
        { provide: AuditService, useValue: {} },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    controller = module.get(UsersController);
  });

  describe('create', () => {
    it(' delegiert an usersService.create', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'Test',
        lastName: 'User',
        roles: [Role.azubi],
      };

      usersService.create.mockResolvedValue({
        id: 'usr-1',
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.create(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it(' delegiert an usersService.findAll', async () => {
      const user = { id: 'usr-1', email: 'test@example.com', roles: [Role.admin] } as any;
      usersService.findAll.mockResolvedValue([]);

      const result = await controller.findAll(user);

      expect(usersService.findAll).toHaveBeenCalledWith(user);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it(' delegiert an usersService.findOne', async () => {
      const user = { id: 'usr-1', email: 'test@example.com', roles: [Role.azubi] } as any;
      usersService.findOne.mockResolvedValue({
        id: 'usr-target',
        email: 'target@example.com',
        firstName: 'Target',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.findOne('usr-target', user);

      expect(usersService.findOne).toHaveBeenCalledWith('usr-target', user);
      expect(result.email).toBe('target@example.com');
    });
  });

  describe('update', () => {
    it(' delegiert an usersService.update', async () => {
      const user = { id: 'usr-1', email: 'test@example.com', roles: [Role.admin] } as any;
      const updateDto = { firstName: 'Updated' };
      usersService.update.mockResolvedValue({
        id: 'usr-1',
        email: 'test@example.com',
        firstName: 'Updated',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.update('usr-1', updateDto, user);

      expect(usersService.update).toHaveBeenCalledWith('usr-1', updateDto, user);
      expect(result.firstName).toBe('Updated');
    });
  });

  describe('remove', () => {
    it(' delegiert an usersService.remove', async () => {
      const user = { id: 'usr-1', email: 'admin@example.com', roles: [Role.admin] } as any;
      usersService.remove.mockResolvedValue({ id: 'usr-1', email: 'deleted@example.com' });

      const result = await controller.remove('usr-1', user);

      expect(usersService.remove).toHaveBeenCalledWith('usr-1', user);
      expect(result.id).toBe('usr-1');
    });
  });

  describe('enableMFA', () => {
    it(' delegiert an usersService.enableMFA', async () => {
      const user = { id: 'usr-1', email: 'test@example.com', roles: [Role.azubi] } as any;
      usersService.enableMFA.mockResolvedValue({ secret: 'JBSWY3DPEHPK3PXP' });

      const result = await controller.enableMFA('usr-1', user);

      expect(usersService.enableMFA).toHaveBeenCalledWith('usr-1', user);
      expect(result.secret).toBe('JBSWY3DPEHPK3PXP');
    });
  });

  describe('verifyMFA', () => {
    it(' delegiert an usersService.verifyMFA', async () => {
      const user = { id: 'usr-1', email: 'test@example.com', roles: [Role.azubi] } as any;
      const verifyDto = { code: '123456' };
      usersService.verifyMFA.mockResolvedValue({ mfaEnabled: true, mfaSecret: 'secret' });

      const result = await controller.verifyMFA('usr-1', verifyDto, user);

      expect(usersService.verifyMFA).toHaveBeenCalledWith('usr-1', verifyDto, user);
      expect(result.mfaEnabled).toBe(true);
    });
  });

  describe('disableMFA', () => {
    it(' delegiert an usersService.disableMFA', async () => {
      const user = { id: 'usr-1', email: 'test@example.com', roles: [Role.azubi] } as any;
      usersService.disableMFA.mockResolvedValue({ mfaEnabled: false, mfaSecret: null });

      const result = await controller.disableMFA('usr-1', user);

      expect(usersService.disableMFA).toHaveBeenCalledWith('usr-1', user);
      expect(result.mfaEnabled).toBe(false);
    });
  });
});