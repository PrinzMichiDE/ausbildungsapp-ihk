import { PrismaService } from '../../database/prisma.service.js';
export interface HealthStatus {
    status: 'ok' | 'error';
    db: 'connected' | 'disconnected';
    uptime: number;
    timestamp: string;
}
export declare class HealthService {
    private readonly prisma;
    private readonly logger;
    private readonly startTime;
    constructor(prisma: PrismaService);
    check(): HealthStatus;
    readiness(): Promise<HealthStatus>;
}
