var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { AuditService } from '../audit/audit.service.js';
import { AusbildungsplanStatus, Prisma } from '@prisma/client';
let AusbildungsplanService = class AusbildungsplanService {
    prisma;
    scope;
    auditService;
    constructor(prisma, scope, auditService) {
        this.prisma = prisma;
        this.scope = scope;
        this.auditService = auditService;
    }
    async create(user, dto) {
        if (!user.roles.some(r => r === Role.ausbilder || r === Role.admin)) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Erstellen' });
        }
        const plan = await this.prisma.ausbildungsplan.create({
            data: {
                azubiId: user.azubiId ?? '',
                ausbilderId: user.id,
                beruf: dto.beruf,
                jahr: dto.jahr,
                inhalte: dto.inhalte ?? Prisma.DbNull,
                status: AusbildungsplanStatus.entwurf,
                anhangUrl: dto.anhangUrl ?? null,
            },
        });
        await this.auditService.create(user, { action: 'CREATE', entity: 'Ausbildungsplan', entityId: plan.id, details: `Neuer Ausbildungsplan erstellt für ${dto.beruf} ${dto.jahr}` });
        return this.toResponse(plan);
    }
    async findAll(user) {
        const isAzubi = user.roles.includes(Role.azubi);
        const isAusbilderOrHr = user.roles.includes(Role.ausbilder) || user.roles.includes(Role.hr);
        const isAdmin = user.roles.includes(Role.admin);
        if (isAdmin) {
            const plans = await this.prisma.ausbildungsplan.findMany();
            return plans.map(p => this.toResponse(p));
        }
        const visibleAzubiIds = await this.scope.getVisibleAzubiIds(user);
        let where = {};
        if (isAzubi) {
            where.azubiId = user.azubiId;
        }
        else if (Array.isArray(visibleAzubiIds)) {
            where.azubiId = { in: visibleAzubiIds };
        }
        else if (isAusbilderOrHr) {
            where.azubiId = { not: null };
        }
        else {
            where.id = null;
        }
        const plans = await this.prisma.ausbildungsplan.findMany({ where });
        return plans.map(p => this.toResponse(p));
    }
    async findOne(user, id) {
        const plan = await this.prisma.ausbildungsplan.findUnique({ where: { id } });
        if (!plan) {
            throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: `Ausbildungsplan ${id} nicht gefunden` });
        }
        await this.assertScopedAccess(user, plan);
        return this.toResponse(plan);
    }
    async update(user, id, dto) {
        const plan = await this.findOne(user, id);
        const isOwner = plan.azubiId === user.azubiId;
        const isAusbilderOrAdmin = user.roles.some(r => r === Role.ausbilder || r === Role.admin);
        if (!isOwner && !isAusbilderOrAdmin) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Aktualisieren' });
        }
        const updated = await this.prisma.ausbildungsplan.update({
            where: { id },
            data: {
                beruf: dto.beruf,
                jahr: dto.jahr,
                inhalte: dto.inhalte,
                anhangUrl: dto.anhangUrl,
            },
        });
        await this.auditService.create(user, { action: 'UPDATE', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} aktualisiert` });
        return this.toResponse(updated);
    }
    async remove(user, id) {
        const plan = await this.findOne(user, id);
        const isOwner = plan.azubiId === user.azubiId;
        const isAdmin = user.roles.includes(Role.admin);
        if (!isOwner && !isAdmin) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Löschen' });
        }
        await this.prisma.ausbildungsplan.delete({ where: { id } });
        await this.auditService.create(user, { action: 'DELETE', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} gelöscht` });
    }
    async submit(user, id) {
        const plan = await this.findOne(user, id);
        if (plan.status !== AusbildungsplanStatus.entwurf) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur Entwürfe können eingereicht werden' });
        }
        const updated = await this.prisma.ausbildungsplan.update({
            where: { id },
            data: { status: AusbildungsplanStatus.eingereicht },
        });
        await this.auditService.create(user, { action: 'SUBMIT', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} eingereicht` });
        return this.toResponse(updated);
    }
    async review(user, id) {
        const plan = await this.findOne(user, id);
        if (plan.status !== AusbildungsplanStatus.eingereicht) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur eingereichte Pläne können geprüft werden' });
        }
        const updated = await this.prisma.ausbildungsplan.update({
            where: { id },
            data: { status: AusbildungsplanStatus.geprueft, geprueftVon: user.id, geprueftAm: new Date() },
        });
        await this.auditService.create(user, { action: 'REVIEW', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} geprüft` });
        return this.toResponse(updated);
    }
    async approve(user, id) {
        const plan = await this.findOne(user, id);
        if (plan.status !== AusbildungsplanStatus.geprueft) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur geprüfte Pläne können genehmigt werden' });
        }
        const updated = await this.prisma.ausbildungsplan.update({
            where: { id },
            data: { status: AusbildungsplanStatus.genehmigt },
        });
        await this.auditService.create(user, { action: 'APPROVE', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} genehmigt` });
        return this.toResponse(updated);
    }
    async getRahmenlehrplan(user, id) {
        const plan = await this.findOne(user, id);
        const frameworks = await this.prisma.framework.findMany({
            where: { titel: plan.beruf },
        });
        await this.auditService.create(user, { action: 'VIEW_RAHMENLEHRPLAN', entity: 'Ausbildungsplan', entityId: id, details: `Rahmenlehrplan für Ausbildungsplan ${id} abgerufen` });
        return { beruf: plan.beruf, jahr: plan.jahr, frameworks };
    }
    async assertScopedAccess(user, plan) {
        const isOwner = plan.azubiId === user.azubiId;
        const isAusbilderOrAdmin = user.roles.some(r => r === Role.ausbilder || r === Role.admin);
        const isAusbildungsbeauftragter = user.roles.includes(Role.ausbildungsbeauftragter);
        const isHr = user.roles.includes(Role.hr);
        if (isOwner || isAusbilderOrAdmin || isHr)
            return;
        if (isAusbildungsbeauftragter) {
            const visibleIds = await this.scope.getVisibleAzubiIds(user);
            if (visibleIds === 'ALL' || (Array.isArray(visibleIds) && visibleIds.includes(plan.azubiId)))
                return;
        }
        throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Kein Zugriff auf diesen Ausbildungsplan' });
    }
    toResponse(plan) {
        return {
            id: plan.id, azubiId: plan.azubiId, ausbilderId: plan.ausbilderId,
            beruf: plan.beruf, jahr: plan.jahr,
            inhalte: plan.inhalte ?? undefined, status: plan.status,
            anhangUrl: plan.anhangUrl ?? undefined,
            gueltigVon: plan.gueltigVon ?? undefined,
            gueltigBis: plan.gueltigBis ?? undefined,
            geprueftVon: plan.geprueftVon ?? undefined,
            geprueftAm: plan.geprueftAm ?? undefined,
            createdAt: plan.createdAt, updatedAt: plan.updatedAt,
        };
    }
};
AusbildungsplanService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService,
        AuditService])
], AusbildungsplanService);
export { AusbildungsplanService };
//# sourceMappingURL=ausbildungsplan.service.js.map