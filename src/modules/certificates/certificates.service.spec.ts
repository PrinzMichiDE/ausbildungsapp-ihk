import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { ZertifikateService } from './certificates.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';

describe('ZertifikateService', () => {
  let service: ZertifikateService;
  let prisma: Record<string, any>;

  const mockUser = {
    id: 'usr-1',
    email: 'test@example.com',
    roles: [{ role: { name: 'admin' } }],
    azubiId: null,
    abteilungIds: [],
  };

  beforeEach(async () => {
    prisma = {
      zertifikat: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ZertifikateService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: AccessScopeService,
          useValue: {
            getVisibleAzubiIds: vi.fn().mockResolvedValue('ALL'),
            assertCanAccessAzubi: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(ZertifikateService);
  });

  describe('create', () => {
    it('erstellt ein Zertifikat', async () => {
      (prisma.zertifikat.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'z-1',
        azubiId: 'az-1',
        titel: 'TypeScript-Zertifikat',
        aussteller: 'T3N',
        erworbenAm: new Date('2026-01-01'),
        dokumentUrl: 'https://example.com/cert.pdf',
      });

      const result = await service.create(mockUser, {
        azubiId: 'az-1',
        titel: 'TypeScript-Zertifikat',
        aussteller: 'T3N',
        erworbenAm: '2026-01-01',
        dokumentUrl: 'https://example.com/cert.pdf',
      });

      expect(result.titel).toBe('TypeScript-Zertifikat');
      expect(prisma.zertifikat.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('gibt alle Zertifikate zurück', async () => {
      (prisma.zertifikat.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        {
          id: 'z-1',
          azubiId: 'az-1',
          titel: 'TS-Zertifikat',
          aussteller: 'T3N',
          erworbenAm: new Date('2026-01-01'),
          dokumentUrl: null,
        },
      ]);

      const result = await service.findAll(mockUser);

      expect(result).toHaveLength(1);
      expect(prisma.zertifikat.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('findet ein Zertifikat by ID', async () => {
      (prisma.zertifikat.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'z-1',
        azubiId: 'az-1',
        titel: 'TS-Zertifikat',
        aussteller: 'T3N',
        erworbenAm: new Date('2026-01-01'),
        dokumentUrl: null,
      });

      const result = await service.findOne('z-1', mockUser);

      expect(result.id).toBe('z-1');
    });
  });

  describe('update', () => {
    it('aktualisiert ein Zertifikat', async () => {
      (prisma.zertifikat.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'z-1',
        azubiId: 'az-1',
        titel: 'Altes Zertifikat',
        aussteller: 'Old',
        erworbenAm: new Date(),
        dokumentUrl: null,
      });
      (prisma.zertifikat.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'z-1',
        azubiId: 'az-1',
        titel: 'Neues Zertifikat',
        aussteller: 'New',
        erworbenAm: new Date(),
        dokumentUrl: 'https://example.com/new.pdf',
      });

      const result = await service.update('z-1', mockUser, {
        titel: 'Neues Zertifikat',
        aussteller: 'New',
        dokumentUrl: 'https://example.com/new.pdf',
      });

      expect(result.titel).toBe('Neues Zertifikat');
    });
  });

  describe('remove', () => {
    it('löscht ein Zertifikat', async () => {
      (prisma.zertifikat.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'z-1',
        azubiId: 'az-1',
        titel: 'Zertifikat',
        aussteller: 'T3N',
        erworbenAm: new Date(),
        dokumentUrl: null,
      });

      await service.remove('z-1', mockUser);

      expect(prisma.zertifikat.delete).toHaveBeenCalled();
    });
  });
});