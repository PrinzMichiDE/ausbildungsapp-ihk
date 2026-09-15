var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthService_1;
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
let HealthService = HealthService_1 = class HealthService {
    prisma;
    logger = new Logger(HealthService_1.name);
    startTime = Date.now();
    constructor(prisma) {
        this.prisma = prisma;
    }
    check() {
        return {
            status: 'ok',
            db: 'connected',
            uptime: (Date.now() - this.startTime) / 1000,
            timestamp: new Date().toISOString(),
        };
    }
    async readiness() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return {
                status: 'ok',
                db: 'connected',
                uptime: (Date.now() - this.startTime) / 1000,
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('DB-Verbindung fehlgeschlagen', error);
            throw new ServiceUnavailableException({
                status: 'error',
                db: 'disconnected',
                timestamp: new Date().toISOString(),
            });
        }
    }
};
HealthService = HealthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], HealthService);
export { HealthService };
//# sourceMappingURL=health.service.js.map