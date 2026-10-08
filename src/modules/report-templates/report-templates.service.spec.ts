import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { ReporttemplateService } from './report-templates.service.js';

describe('ReporttemplateService', () => {
  let service: ReporttemplateService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      reportTemplate: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReporttemplateService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(ReporttemplateService);
  });

  describe('create', () => {
    it('erstellt ein Reporttemplate', async () => {
      (prisma.reportTemplate.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'rt-1',
        name: 'Monatsbericht',
      });

      const result = await service.create({ name: 'Monatsbericht' });
      expect(result.name).toBe('Monatsbericht');
    });
  });

  describe('findAll', () => {
    it('gibt alle Reporttemplates zurück', async () => {
      (prisma.reportTemplate.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'rt-1', name: 'Monatsbericht' },
      ]);

      const result = await service.findAll({
        id: 'usr-1',
        email: 'test@example.com',
        roles: [],
        azubiId: null,
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('findet ein Reporttemplate by ID', async () => {
      (prisma.reportTemplate.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'rt-1',
        name: 'Monatsbericht',
      });

      const result = await service.findOne('rt-1');
      expect(result?.name).toBe('Monatsbericht');
    });
  });
});