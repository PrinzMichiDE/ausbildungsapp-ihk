import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { WikiService } from './wiki.service.js';

describe('WikiService', () => {
  let service: WikiService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = {
      wikiPage: {
        findMany: vi.fn().mockResolvedValue([]),
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WikiService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(WikiService);
  });

  describe('create', () => {
    it('erstellt eine Wiki-Seite', async () => {
      (prisma.wikiPage.create as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'wp-1',
        titel: 'Test Seite',
        slug: 'test-seite',
        kategorie: 'Doku',
        inhaltMarkdown: '# Test',
      });

      const result = await service.create({
        titel: 'Test Seite',
        slug: 'test-seite',
        kategorie: 'Doku',
        inhaltMarkdown: '# Test',
      });

      expect(result.titel).toBe('Test Seite');
      expect(result.slug).toBe('test-seite');
    });
  });

  describe('findAll', () => {
    it('gibt alle Wiki-Seiten zurück', async () => {
      (prisma.wikiPage.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([
        { id: 'wp-1', titel: 'Seite 1', slug: 'seite-1', kategorie: 'Doku', inhaltMarkdown: '# Test' },
        { id: 'wp-2', titel: 'Seite 2', slug: 'seite-2', kategorie: 'FAQ', inhaltMarkdown: '# Test' },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
    });
  });

  describe('findBySlug', () => {
    it('findet eine Seite by Slug', async () => {
      (prisma.wikiPage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'wp-1',
        titel: 'Test Seite',
        slug: 'test-seite',
        kategorie: 'Doku',
        inhaltMarkdown: '# Test',
      });

      const result = await service.findBySlug('test-seite');
      expect(result.titel).toBe('Test Seite');
    });

    it('wirft NotFoundException bei nicht gefundenem Slug', async () => {
      (prisma.wikiPage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(service.findBySlug('nicht-existent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('aktualisiert eine Wiki-Seite', async () => {
      (prisma.wikiPage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'wp-1',
        titel: 'Alte Seite',
        slug: 'alte-seite',
        kategorie: 'Doku',
        inhaltMarkdown: '# Alt',
      });
      (prisma.wikiPage.update as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'wp-1',
        titel: 'Neue Seite',
        slug: 'alte-seite',
        kategorie: 'FAQ',
        inhaltMarkdown: '# Neu',
      });

      const result = await service.update('wp-1', { titel: 'Neue Seite', kategorie: 'FAQ', inhaltMarkdown: '# Neu' });
      expect(result.titel).toBe('Neue Seite');
    });
  });

  describe('remove', () => {
    it('löscht eine Wiki-Seite', async () => {
      (prisma.wikiPage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'wp-1',
        titel: 'Test Seite',
        slug: 'test-seite',
        kategorie: 'Doku',
        inhaltMarkdown: '# Test',
      });

      await service.remove('wp-1');
      expect(prisma.wikiPage.delete).toHaveBeenCalledWith({ where: { id: 'wp-1' } });
    });
  });

  describe('getById', () => {
    it('findet eine Seite by ID', async () => {
      (prisma.wikiPage.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
        id: 'wp-1',
        titel: 'Test Seite',
        slug: 'test-seite',
        kategorie: 'Doku',
        inhaltMarkdown: '# Test',
      });

      const result = await service.getById('wp-1');
      expect(result.titel).toBe('Test Seite');
    });
  });
});