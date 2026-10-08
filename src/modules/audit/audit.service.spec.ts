import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AuditService } from './audit.service.js';
import { Role } from '../../common/constants/roles.js';

describe('AuditService', () => {
  let service: AuditService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      auditEvent: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        count: vi.fn().mockResolvedValue(0),
        findFirst: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AuditService);
  });

  describe('findAll', () => {
    it('gibt alle Events zurück wenn Admin', async () => {
      const adminUser = {
        id: 'usr-admin',
        email: 'admin@example.com',
        roles: [
          { role: { name: 'admin' } },
          { role: { name: 'ausbildungsbeauftragter' } },
          { role: { name: 'azubi' } },
          { role: { name: 'ausbilder' } },
        ],
      };

      (prisma.auditEvent.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 'evt-1' }]);

      const result = await service.findAll(adminUser as any);
      expect(result).toEqual([{ id: 'evt-1' }]);
      expect(prisma.auditEvent.findMany).toHaveBeenCalledWith({
        take: 50,
        orderBy: { timestamp: 'desc' },
        include: { user: true },
      });
    });

    it('filtert Events nach Rolle', async () => {
      const ausbilderUser = {
        id: 'usr-ausbilder',
        email: 'ausbilder@example.com',
        roles: [{ role: { name: 'ausbilder' } }],
      };

      (prisma.auditEvent.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 'evt-2' }]);

      const result = await service.findAll(ausbilderUser as any);
      expect(result).toEqual([{ id: 'evt-2' }]);
    });
  });

  describe('findOne', () => {
    it('findet Event by ID', async () => {
      (prisma.auditEvent.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'evt-1',
        action: 'user.created',
        userId: 'usr-1',
        metadata: {},
      });

      const result = await service.findOne('evt-1');
      expect(result).toEqual({
        id: 'evt-1',
        action: 'user.created',
        userId: 'usr-1',
        metadata: {},
      });
      expect(prisma.auditEvent.findUnique).toHaveBeenCalledWith({
        where: { id: 'evt-1' },
      });
    });

    it('wirft NotFoundException wenn Event nicht exists', async () => {
      (prisma.auditEvent.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.findOne('evt-nonexistent')).rejects.toThrow();
    });
  });

  describe('countByAction', () => {
    it('countet Events nach action', async () => {
      (prisma.auditEvent.count as ReturnType<typeof vi.fn>).mockResolvedValue(5);

      const result = await service.countByAction('user.created');
      expect(result).toBe(5);
      expect(prisma.auditEvent.count).toHaveBeenCalledWith({
        where: { action: 'user.created' },
      });
    });
  });

  describe('getRecentByUser', () => {
    it('gibt letzte Events eines Users zurück', async () => {
      (prisma.auditEvent.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'evt-last',
        action: 'course.updated',
      });

      const result = await service.getRecentByUser('usr-1');
      expect(result).toEqual({
        id: 'evt-last',
        action: 'course.updated',
      });
      expect(prisma.auditEvent.findFirst).toHaveBeenCalledWith({
        where: { userId: 'usr-1' },
        orderBy: { timestamp: 'desc' },
        take: 1,
      });
    });
  });

  describe('logEvent', () => {
    it('erstellt ein neues Audit Event', async () => {
      (prisma.auditEvent.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'evt-new',
        action: 'user.updated',
        userId: 'usr-1',
        metadata: { key: 'value' },
      });

      const result = await service.logEvent({
        userId: 'usr-1',
        action: 'user.updated',
        metadata: { key: 'value' },
      });

      expect(result).toEqual({
        id: 'evt-new',
        action: 'user.updated',
        userId: 'usr-1',
        metadata: { key: 'value' },
      });
      expect(prisma.auditEvent.create).toHaveBeenCalledWith({
        data: {
          userId: 'usr-1',
          action: 'user.updated',
          metadata: { key: 'value' },
        },
      });
    });
  });
});