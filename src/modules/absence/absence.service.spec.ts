import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AbwesenheitService } from './absence.service.js';
import { Role, AbwesenheitTyp, AbwesenheitQuelle } from '@prisma/client';

describe('AbwesenheitService', () => {
  let service: AbwesenheitService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;
  let scope: Record<string, ReturnType<typeof vi.fn>>;

  const adminUser = {
    id: 'usr-1',
    email: 'admin@example.com',
    roles: [Role.admin],
    azubiId: null,
    abteilungIds: [],
  };

  beforeEach(async () => {
    prisma = {
      abwesenheit: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
    };
    scope = {
      getVisibleAzubiIds: vi.fn().mockResolvedValue(new Set(['az-1'])),
      assertCanAccessAzubi: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbwesenheitService,
        { provide: PrismaService, useValue: prisma },
        { provide: AccessScopeService, useValue: scope },
      ],
    }).compile();

    service = module.get(AbwesenheitService);
  });

  describe('create', () => {
    it('erstellt eine Abwesenheit als Admin', async () => {
      (prisma.abwesenheit.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'abw-1',
        azubiId: 'az-1',
        typ: AbwesenheitTyp.krank,
        quelle: AbwesenheitQuelle.manuell,
        von: new Date('2026-01-01'),
        bis: new Date('2026-01-02'),
        notiz: 'Krank',
      });

      const result = await service.create(adminUser, {
        azubiId: 'az-1',
        typ: AbwesenheitTyp.krank,
        von: '2026-01-01',
        bis: '2026-01-02',
        notiz: 'Krank',
      });

      expect(result.id).toBe('abw-1');
      expect(prisma.abwesenheit.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('gibt Abwesenheiten zurück', async () => {
      (prisma.abwesenheit.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          id: 'abw-1',
          azubiId: 'az-1',
          typ: AbwesenheitTyp.krank,
          quelle: AbwesenheitQuelle.manuell,
          von: new Date(),
          bis: new Date(),
          notiz: null,
        },
      ]);

      const result = await service.findAll(adminUser);
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('findet eine Abwesenheit', async () => {
      (prisma.abwesenheit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'abw-1',
        azubiId: 'az-1',
        typ: AbwesenheitTyp.krank,
        quelle: AbwesenheitQuelle.manuell,
        von: new Date(),
        bis: new Date(),
        notiz: null,
      });

      const result = await service.findOne('abw-1', adminUser);
      expect(result.id).toBe('abw-1');
    });
  });

  describe('remove', () => {
    it('löscht eine Abwesenheit', async () => {
      (prisma.abwesenheit.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'abw-1',
        azubiId: 'az-1',
        typ: AbwesenheitTyp.krank,
        quelle: AbwesenheitQuelle.manuell,
        von: new Date(),
        bis: new Date(),
        notiz: null,
      });

      await service.remove('abw-1', adminUser);
      expect(prisma.abwesenheit.delete).toHaveBeenCalledWith({ where: { id: 'abw-1' } });
    });
  });
});