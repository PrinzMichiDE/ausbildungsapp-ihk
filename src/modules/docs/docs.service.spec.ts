import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { DocsService } from './docs.service.js';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn().mockResolvedValue('# Test Doc\n\nContent'),
}));

vi.mock('marked', () => ({
  marked: {
    parse: vi.fn().mockResolvedValue('<p>Content</p>'),
  },
}));

describe('DocsService', () => {
  let service: DocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocsService],
    }).compile();

    service = module.get(DocsService);
  });

  describe('getDoc', () => {
    it('gibt eine Doc als HTML zurück', async () => {
      const result = await service.getDoc('readme');
      expect(result.title).toBe('README');
      expect(result.html).toBe('<p>Content</p>');
    });
  });

  describe('listDocs', () => {
    it('listet verfügbare Docs', () => {
      const result = service.listDocs();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('slug');
      expect(result[0]).toHaveProperty('title');
    });
  });
});