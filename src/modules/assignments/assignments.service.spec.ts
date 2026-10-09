import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { EinsatzService } from './assignments.service.js';
import { Role } from '../../common/constants/roles.js';

describe('EinsatzService', () => {
  let service: EinsatzService;
  let prisma: Record<string, any>;
  let scope: Record<string, any>;

  const ausbilderUser = {
    id: 'usr-1',
    email: 'ausbilder@example.com',
    roles: [Role.ausbilder],
    azubiId: null,
    abteilungIds: [],
  };

  const azubiUser = {
    id: 'usr-2',
    email: 'azubi@example.com',
    roles: [Role.azubi],
    azubiId: 'az-1',
    abteilungIds: [],
  };

  beforeEach(async () => {
    prisma = {
      einsatz: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
        count: vi.fn().mockResolvedValue(0),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue({ id: 'az-1', firstName: 'Max', lastName: 'Mustermann' }),
      },
    };
    scope = {
      getVisibleAzubiIds: vi.fn().mockResolvedValue(new Set(['az-1'])),
      assertCanAccessAzubi: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EinsatzService,
        { provide: PrismaService, useValue: prisma },
        { provide: AccessScopeService, useValue: scope },
      ],
    }).compile();

    service = module.get(EinsatzService);
  });

  describe('create', () => {
    it('erstellt einen Einsatz', async () => {
      (prisma.einsatz.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ei-1',
        azubiId: 'az-1',
        abteilungId: 'ab-1',
        von: new Date('2026-01-01'),
        bis: new Date('2026-01-31'),
        skillLevel: 3,
      });

      const result = await service.create({
        azubiId: 'az-1',
        abteilungId: 'ab-1',
        von: '2026-01-01',
        bis: '2026-01-31',
        skillLevel: 3,
      });

      expect(result.id).toBe('ei-1');
      expect(prisma.einsatz.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('gibt Einsätze zurück', async () => {
      (prisma.einsatz.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      const result = await service.findAll(azubiUser);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findOne', () => {
    it('findet einen Einsatz', async () => {
      (prisma.einsatz.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ei-1',
        azubiId: 'az-1',
        abteilungId: 'ab-1',
        von: new Date(),
        bis: new Date(),
        skillLevel: 3,
      });

      const result = await service.findOne('ei-1', ausbilderUser);
      expect(result.id).toBe('ei-1');
    });
  });
});