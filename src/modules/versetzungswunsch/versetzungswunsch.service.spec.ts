import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { VersetzungswunschService } from './versetzungswunsch.service.js';

describe('VersetzungswunschService', () => {
  let service: VersetzungswunschService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      versetzungswunsch: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersetzungswunschService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(VersetzungswunschService);
  });

  describe('create', () => {
    it('erstellt einen Versetzungswunsch', async () => {
      (prisma.versetzungswunsch.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'vw-1',
        begruendung: 'Bessere Anbindung',
      });

      const result = await service.create({ begruendung: 'Bessere Anbindung' });
      expect(result.begruendung).toBe('Bessere Anbindung');
    });
  });

  describe('findAll', () => {
    it('gibt alle Versetzungswünsche zurück', async () => {
      (prisma.versetzungswunsch.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'vw-1', begruendung: 'Bessere Anbindung' },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('findet einen Versetzungswunsch by ID', async () => {
      (prisma.versetzungswunsch.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'vw-1',
        begruendung: 'Bessere Anbindung',
      });

      const result = await service.findOne('vw-1');
      expect(result?.begruendung).toBe('Bessere Anbindung');
    });
  });
});