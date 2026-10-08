import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { AbteilungenService } from './departments.service.js';

describe('AbteilungenService', () => {
  let service: AbteilungenService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      abteilung: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AbteilungenService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(AbteilungenService);
  });

  describe('create', () => {
    it('erstellt eine neue Abteilung', async () => {
      (prisma.abteilung.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ab-1',
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: 'IT-Abteilung',
      });

      const result = await service.create({
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: 'IT-Abteilung',
      });

      expect(result).toEqual({
        id: 'ab-1',
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: 'IT-Abteilung',
      });
      expect(prisma.abteilung.create).toHaveBeenCalledWith({
        data: { name: 'IT', kurzzeichen: 'IT', beschreibung: 'IT-Abteilung' },
      });
    });
  });

  describe('findAll', () => {
    it('gibt alle Abteilungen zurück', async () => {
      (prisma.abteilung.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'ab-1', name: 'IT', kurzzeichen: 'IT', beschreibung: null },
        { id: 'ab-2', name: 'HR', kurzzeichen: 'HR', beschreibung: null },
      ]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(prisma.abteilung.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('findet eine Abteilung by ID', async () => {
      (prisma.abteilung.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ab-1',
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: 'IT-Abteilung',
      });

      const result = await service.findOne('ab-1');

      expect(result).toEqual({
        id: 'ab-1',
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: 'IT-Abteilung',
      });
      expect(prisma.abteilung.findUnique).toHaveBeenCalledWith({
        where: { id: 'ab-1' },
      });
    });

    it('wirft NotFoundException wenn Abteilung nicht existiert', async () => {
      (prisma.abteilung.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.findOne('ab-nonexistent')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('aktualisiert eine Abteilung', async () => {
      (prisma.abteilung.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ab-1',
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: null,
      });
      (prisma.abteilung.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ab-1',
        name: 'IT-Entwicklung',
        kurzzeichen: 'IT',
        beschreibung: 'Neue Beschreibung',
      });

      const result = await service.update('ab-1', {
        name: 'IT-Entwicklung',
        beschreibung: 'Neue Beschreibung',
      });

      expect(result.name).toBe('IT-Entwicklung');
      expect(prisma.abteilung.update).toHaveBeenCalledWith({
        where: { id: 'ab-1' },
        data: { name: 'IT-Entwicklung', beschreibung: 'Neue Beschreibung' },
      });
    });
  });

  describe('remove', () => {
    it('löscht eine Abteilung', async () => {
      (prisma.abteilung.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'ab-1',
        name: 'IT',
        kurzzeichen: 'IT',
        beschreibung: null,
      });

      await service.remove('ab-1');

      expect(prisma.abteilung.delete).toHaveBeenCalledWith({
        where: { id: 'ab-1' },
      });
    });
  });
});