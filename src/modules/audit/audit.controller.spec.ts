import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service.js';
import { AuditController } from './audit.controller.js';
import { PrismaService } from '../../database/prisma.service.js';
import { Role } from '../../common/constants/roles.js';

describe('AuditController', () => {
  let controller: AuditController;
  let auditService: Record<string, any>;

  beforeEach(async () => {
    auditService = {
      findAll: vi.fn(),
      findOne: vi.fn(),
      count: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        AuditService,
        { provide: PrismaService, useValue: {} },
      ],
    })
      .overrideProvider(AuditService)
      .useValue(auditService)
      .compile();

    controller = module.get(AuditController);
  });

  describe('findAll', () => {
    it(' delegiert an auditService.findAll', async () => {
      const user = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.admin],
      } as any;

      auditService.findAll.mockResolvedValue([
        {
          id: 'log-1',
          userId: 'usr-1',
          action: 'user.created',
          entity: 'User',
          entityId: 'usr-1',
          details: null,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla',
          createdAt: new Date(),
        },
      ]);

      const result = await controller.findAll(user);

      expect(auditService.findAll).toHaveBeenCalledWith(user);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].action).toBe('user.created');
    });
  });

  describe('findOne', () => {
    it(' delegiert an auditService.findOne', async () => {
      const user = {
        id: 'usr-1',
        email: 'test@example.com',
        roles: [Role.admin],
      } as any;

      auditService.findOne.mockResolvedValue({
        id: 'log-1',
        userId: 'usr-1',
        action: 'task.completed',
        entity: 'Task',
        entityId: 'task-1',
        details: null,
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome',
        createdAt: new Date(),
      });

      const result = await controller.findOne('log-1', user);

      expect(auditService.findOne).toHaveBeenCalledWith('log-1', user);
      expect(result.id).toBe('log-1');
      expect(result.action).toBe('task.completed');
    });
  });
});