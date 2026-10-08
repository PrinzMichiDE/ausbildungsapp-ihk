import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service.js';
import { SearchService } from './search.service.js';

describe('SearchService', () => {
  let service: SearchService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      report: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      wikiPage: {
        findMany: vi.fn().mockResolvedValue([]),
      },
      course: {
        findMany: vi.fn().mockResolvedValue([]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(SearchService);
  });

  describe('search', () => {
    it('sucht in reports, wiki und courses', async () => {
      (prisma.report.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 'r-1', titel: 'Test Report' }]);
      (prisma.wikiPage.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 'w-1', titel: 'Test Wiki' }]);
      (prisma.course.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: 'c-1', titel: 'Test Course' }]);

      const result = await service.search('Test');

      expect(result.reports).toHaveLength(1);
      expect(result.wiki).toHaveLength(1);
      expect(result.courses).toHaveLength(1);
      expect(prisma.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ titel: expect.objectContaining({ contains: 'Test', mode: 'insensitive' }) }) }),
      );
    });
  });
});