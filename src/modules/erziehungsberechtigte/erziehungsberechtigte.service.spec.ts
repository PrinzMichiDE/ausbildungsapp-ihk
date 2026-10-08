import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { ErziehungsberechtigteService } from './erziehungsberechtigte.service.js';
import { Role } from '../../common/constants/roles.js';

describe('ErziehungsberechtigteService', () => {
  let service: ErziehungsberechtigteService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  const ausbilderUser = {
    id: 'usr-1',
    email: 'ausbilder@example.com',
    roles: [Role.ausbilder],
    azubiId: null,
  };

  const azubiUser = {
    id: 'usr-2',
    email: 'azubi@example.com',
    roles: [Role.azubi],
    azubiId: 'az-1',
  };

  beforeEach(async () => {
    prisma = {
      erziehungsberechtigter: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErziehungsberechtigteService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: AccessScopeService,
          useValue: {
            getVisibleAzubiIds: vi.fn().mockResolvedValue(new Set(['az-1'])),
            assertCanAccessAzubi: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(ErziehungsberechtigteService);
  });

  describe('create', () => {
    it('erstellt einen Erziehungsberechtigten als Ausbilder', async () => {
      (prisma.erziehungsberechtigter.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'erb-1',
        name: 'Max Mustermann',
      });

      const result = await service.create(ausbilderUser, { name: 'Max Mustermann' });
      expect(result.name).toBe('Max Mustermann');
    });

    it('wirft ForbiddenException wenn kein Ausbilder', async () => {
      await expect(service.create(azubiUser, { name: 'Test' })).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('gibt alle zurück für Admin', async () => {
      (prisma.erziehungsberechtigter.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'erb-1', name: 'Max' },
      ]);

      const adminUser = { ...ausbilderUser, roles: [Role.admin] };
      const result = await service.findAll(adminUser);
      expect(result).toHaveLength(1);
    });

    it('filtert nach azubiId für Azubi', async () => {
      (prisma.erziehungsberechtigter.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);
      await service.findAll(azubiUser);
      expect(prisma.erziehungsberechtigter.findMany).toHaveBeenCalledWith({
        where: { azubiId: 'az-1' },
      });
    });
  });
});