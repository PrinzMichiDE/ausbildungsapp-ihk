import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiService } from './ai.service.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';

describe('AiService', () => {
  let service: AiService;

  const mockConfigService: Partial<ConfigService> = {
    get: vi.fn().mockReturnValue({
      provider: 'ollama',
      baseUrl: 'http://localhost:11434',
      model: 'llama3',
      embeddingModel: 'nomic-embed',
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get(AiService);
  });

  describe('completeJson', () => {
    it('parst JSON aus Ollama-Antwort', async () => {
      const originalPost = (service as any).post;
      (service as any).post = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ response: '{"answer": "test"}' }),
      });

      const result = await service.completeJson('system', 'user');
      expect(result).toEqual({ answer: 'test' });
    });

    it('wirft BusinessException bei ungültigem JSON', async () => {
      const originalPost = (service as any).post;
      (service as any).post = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ response: 'not json' }),
      });

      await expect(service.completeJson('system', 'user')).rejects.toThrow(
        BusinessException,
      );
    });
  });

  describe('embed', () => {
    it('gibt Embedding zurück', async () => {
      (service as any).post = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ embeddings: [[0.1, 0.2, 0.3]] }),
      });

      const result = await service.embed('test text');
      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('gibt leeres Array bei Fehler zurück', async () => {
      (service as any).post = vi.fn().mockRejectedValue(new Error('network error'));

      const result = await service.embed('test text');
      expect(result).toEqual([]);
    });
  });
});