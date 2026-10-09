import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AusbildungsvertragService } from './ausbildungsvertrag.service.js';
import { Role } from '../../common/constants/roles.js';

describe('AusbildungsvertragService', () => {
  let service: AusbildungsvertragService;
  let prisma: Record<string, any>;

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
      ausbildungsvertrag: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AusbildungsvertragService,
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

    service = module.get(AusbildungsvertragService);
  });

  describe('create', () => {
    it('erstellt einen Vertrag als Ausbilder', async () => {
      (prisma.ausbildungsvertrag.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'av-1',
        azubiId: 'az-1',
        startdatum: '2026-01-01',
      });

      const result = await service.create(ausbilderUser, { azubiId: 'az-1', startdatum: '2026-01-01' });
      expect(result.startdatum).toBe('2026-01-01');
    });

    it('wirft ForbiddenException wenn kein Ausbilder', async () => {
      await expect(service.create(azubiUser, { azubiId: 'az-1' })).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('filtert nach azubiId für Azubi', async () => {
      (prisma.ausbildungsvertrag.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'av-1', azubiId: 'az-1', startdatum: '2026-01-01' },
      ]);

      await service.findAll(azubiUser);
      expect(prisma.ausbildungsvertrag.findMany).toHaveBeenCalledWith({
        where: { azubiId: 'az-1' },
      });
    });
  });
});