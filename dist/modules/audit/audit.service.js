var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(currentUser) {
        if (!this.canManage(currentUser)) {
            const where = { userId: currentUser.id };
            const items = await this.prisma.auditEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 100,
            });
            return items.map((e) => this.toResponse(e));
        }
        const items = await this.prisma.auditEvent.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
        return items.map((e) => this.toResponse(e));
    }
    async findOne(id, currentUser) {
        const event = await this.prisma.auditEvent.findUnique({ where: { id } });
        if (!event) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.AUDIT_EVENT_NOT_FOUND,
                message: `Audit-Event ${id} nicht gefunden`,
            });
        }
        if (!this.canManage(currentUser) &&
            event.userId !== currentUser.id) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Kein Zugriff auf dieses Audit-Event',
            });
        }
        return this.toResponse(event);
    }
    async create(currentUser, dto) {
        const event = await this.prisma.auditEvent.create({
            data: {
                userId: currentUser.id,
                action: dto.action,
                entity: dto.entity ?? null,
                entityId: dto.entityId ?? null,
                details: dto.details ?? null,
                ipAddress: dto.ipAddress ?? null,
                userAgent: dto.userAgent ?? null,
            },
        });
        return this.toResponse(event);
    }
    canManage(user) {
        return user.roles.some((r) => r === Role.ausbilder || r === Role.hr || r === Role.admin);
    }
    toResponse(e) {
        return {
            id: e.id,
            userId: e.userId,
            action: e.action,
            entity: e.entity,
            entityId: e.entityId,
            details: e.details,
            ipAddress: e.ipAddress,
            userAgent: e.userAgent,
            createdAt: e.createdAt,
        };
    }
};
AuditService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AuditService);
export { AuditService };
//# sourceMappingURL=audit.service.js.map