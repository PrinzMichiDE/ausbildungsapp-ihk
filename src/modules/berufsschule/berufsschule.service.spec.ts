import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { BerufsschuleService } from './berufsschule.service.js';

describe('BerufsschuleService', () => {
  let service: BerufsschuleService;
  let prisma: Record<string, any>;

  beforeEach(async () => {
    prisma = {
      berufsschule: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BerufsschuleService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(BerufsschuleService);
  });

  describe('create', () => {
    it('erstellt einen Berufsschule-Eintrag', async () => {
      (prisma.berufsschule.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'bs-1',
        name: 'BS1',
      });

      const result = await service.create({ name: 'BS1' });

      expect(result).toEqual({ id: 'bs-1', name: 'BS1' });
      expect(prisma.berufsschule.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('gibt alle Berufsschulen zurück', async () => {
      (prisma.berufsschule.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'bs-1', name: 'BS1' },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(prisma.berufsschule.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('findet eine Berufsschule by ID', async () => {
      (prisma.berufsschule.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'bs-1',
        name: 'BS1',
      });

      const result = await service.findOne('bs-1');

      expect(result).toEqual({ id: 'bs-1', name: 'BS1' });
    });
  });
});