import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { FoerderbedarfService } from './foerderbedarf.service.js';

describe('FoerderbedarfService', () => {
  let service: FoerderbedarfService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      foerderbedarf: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoerderbedarfService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(FoerderbedarfService);
  });

  describe('create', () => {
    it('erstellt einen Foerderbedarf-Eintrag', async () => {
      (prisma.foerderbedarf.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'fb-1',
        beschreibung: 'Mehr Praxis',
      });

      const result = await service.create({ beschreibung: 'Mehr Praxis' });
      expect(result.beschreibung).toBe('Mehr Praxis');
    });
  });

  describe('findAll', () => {
    it('gibt alle Foerderbedarfe zurück', async () => {
      (prisma.foerderbedarf.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'fb-1', beschreibung: 'Mehr Praxis' },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('findet einen Foerderbedarf by ID', async () => {
      (prisma.foerderbedarf.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'fb-1',
        beschreibung: 'Mehr Praxis',
      });

      const result = await service.findOne('fb-1');
      expect(result?.beschreibung).toBe('Mehr Praxis');
    });
  });
});