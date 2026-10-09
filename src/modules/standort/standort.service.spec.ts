import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { StandortService } from './standort.service.js';

describe('StandortService', () => {
  let service: StandortService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      standort: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandortService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(StandortService);
  });

  describe('findAll', () => {
    it('gibt alle Standorte zurück', async () => {
      (prisma.standort.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 's-1', name: 'Hauptstandort', adresse: 'Hauptstr. 1', plz: '12345', ort: 'Berlin' },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Hauptstandort');
    });
  });

  describe('findOne', () => {
    it('findet einen Standort', async () => {
      (prisma.standort.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 's-1',
        name: 'Hauptstandort',
        adresse: 'Hauptstr. 1',
        plz: '12345',
        ort: 'Berlin',
      });

      const result = await service.findOne('s-1');
      expect(result.name).toBe('Hauptstandort');
    });

    it('wirft NotFoundException wenn nicht gefunden', async () => {
      (prisma.standort.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.findOne('s-nonexistent')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('erstellt einen Standort', async () => {
      (prisma.standort.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 's-1',
        name: 'Neuer Standort',
        adresse: 'Neue Str. 1',
        plz: '54321',
        ort: 'München',
      });

      const result = await service.create({
        name: 'Neuer Standort',
        adresse: 'Neue Str. 1',
        plz: '54321',
        ort: 'München',
      });

      expect(result.name).toBe('Neuer Standort');
    });
  });

  describe('remove', () => {
    it('löscht einen Standort', async () => {
      (prisma.standort.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 's-1',
        name: 'Hauptstandort',
        adresse: 'Hauptstr. 1',
        plz: '12345',
        ort: 'Berlin',
      });

      await service.remove('s-1');
      expect(prisma.standort.delete).toHaveBeenCalledWith({ where: { id: 's-1' } });
    });
  });
});