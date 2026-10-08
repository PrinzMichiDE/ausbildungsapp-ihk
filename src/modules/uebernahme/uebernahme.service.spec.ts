import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { UebernahmegespraechService } from './uebernahme.service.js';

describe('UebernahmegespraechService', () => {
  let service: UebernahmegespraechService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      uebernahmeGespraech: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UebernahmegespraechService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(UebernahmegespraechService);
  });

  describe('create', () => {
    it('erstellt ein Uebernahme-Gespraech', async () => {
      (prisma.uebernahmeGespraech.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ug-1',
        notizen: 'Positives Feedback',
      });

      const result = await service.create({ notizen: 'Positives Feedback' });
      expect(result.notizen).toBe('Positives Feedback');
    });
  });

  describe('findAll', () => {
    it('gibt alle Gespräche zurück', async () => {
      (prisma.uebernahmeGespraech.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'ug-1', notizen: 'Positives Feedback' },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('findet ein Gespräch by ID', async () => {
      (prisma.uebernahmeGespraech.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ug-1',
        notizen: 'Positives Feedback',
      });

      const result = await service.findOne('ug-1');
      expect(result?.notizen).toBe('Positives Feedback');
    });
  });
});