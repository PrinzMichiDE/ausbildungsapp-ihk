import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AlumniService } from './alumni.service.js';

describe('AlumniService', () => {
  let service: AlumniService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      alumni: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlumniService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AlumniService);
  });

  describe('create', () => {
    it('erstellt einen Alumni-Eintrag', async () => {
      (prisma.alumni.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'al-1',
        name: 'Max Mustermann',
      });

      const result = await service.create({ name: 'Max Mustermann' });

      expect(result).toEqual({ id: 'al-1', name: 'Max Mustermann' });
    });
  });

  describe('findAll', () => {
    it('gibt alle Alumni zurück', async () => {
      (prisma.alumni.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'al-1', name: 'Max' },
        { id: 'al-2', name: 'Erika' },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('findet einen Alumni by ID', async () => {
      (prisma.alumni.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'al-1',
        name: 'Max',
      });

      const result = await service.findOne('al-1');

      expect(result).toEqual({ id: 'al-1', name: 'Max' });
    });
  });
});