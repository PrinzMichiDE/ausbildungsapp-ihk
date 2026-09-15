import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

export interface HealthStatus {
  status: 'ok' | 'error';
  db: 'connected' | 'disconnected';
  uptime: number;
  timestamp: string;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  check(): HealthStatus {
    return {
      status: 'ok',
      db: 'connected',
      uptime: (Date.now() - this.startTime) / 1000,
      timestamp: new Date().toISOString(),
    };
  }

  async readiness(): Promise<HealthStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        db: 'connected',
        uptime: (Date.now() - this.startTime) / 1000,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('DB-Verbindung fehlgeschlagen', error);
      throw new ServiceUnavailableException({
        status: 'error',
        db: 'disconnected',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
