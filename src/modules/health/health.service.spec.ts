import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service.js';
import { PrismaService } from '../../database/prisma.service.js';

describe('HealthService', () => {
  let service: HealthService;
  let prisma: { $queryRaw: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    prisma = { $queryRaw: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(HealthService);
  });

  describe('check', () => {
    it('gibt status ok mit uptime und timestamp zurück', () => {
      const result = service.check();

      expect(result.status).toBe('ok');
      expect(result.db).toBe('connected');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp).getTime()).not.toBeNaN();
    });
  });

  describe('readiness', () => {
    it('gibt status ok zurück wenn DB erreichbar', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await service.readiness();

      expect(result.status).toBe('ok');
      expect(result.db).toBe('connected');
      expect(prisma.$queryRaw).toHaveBeenCalledOnce();
    });

    it('wirft ServiceUnavailableException wenn DB nicht erreichbar', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection refused'));

      await expect(service.readiness()).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
