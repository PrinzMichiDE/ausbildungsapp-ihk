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
const STATUS_ENTWURF = 'entwurf';
const STATUS_EINGEREICHT = 'eingereicht';
const STATUS_IN_PRUEFUNG = 'in_pruefung';
const STATUS_VISIERT = 'visiert';
const STATUS_ARCHIVIERT = 'archiviert';
let AusbildungsnachweisService = class AusbildungsnachweisService {
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
        const nachweis = await this.prisma.ausbildungsnachweis.create({
            data: {
                azubiId: user.azubiId ?? '',
                titel: dto.titel,
                inhaltMarkdown: dto.inhaltMarkdown,
            },
        });
        await this.auditService.create(user, { action: 'CREATE', entity: 'Ausbildungsnachweis', entityId: nachweis.id, details: `Nachweis ${dto.titel} erstellt` });
        return this.toResponse(nachweis);
    }
    async findAll(user) {
        const isAzubi = user.roles.includes(Role.azubi);
        const isAusbilderOrHr = user.roles.some(r => r === Role.ausbilder || r === Role.hr);
        const isAdmin = user.roles.includes(Role.admin);
        if (isAdmin || isAusbilderOrHr) {
            const items = await this.prisma.ausbildungsnachweis.findMany();
            return items.map(i => this.toResponse(i));
        }
        if (isAzubi && user.azubiId) {
            const items = await this.prisma.ausbildungsnachweis.findMany({ where: { azubiId: user.azubiId } });
            return items.map(i => this.toResponse(i));
        }
        const visible = await this.scope.getVisibleAzubiIds(user);
        if (visible === 'ALL') {
            const items = await this.prisma.ausbildungsnachweis.findMany();
            return items.map(i => this.toResponse(i));
        }
        const items = await this.prisma.ausbildungsnachweis.findMany({
            where: { azubiId: { in: [...visible] } },
        });
        return items.map(i => this.toResponse(i));
    }
    async findOne(user, id) {
        const nachweis = await this.prisma.ausbildungsnachweis.findUnique({ where: { id } });
        if (!nachweis) {
            throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: `Nachweis ${id} nicht gefunden` });
        }
        await this.assertScopedAccess(user, nachweis);
        return this.toResponse(nachweis);
    }
    async update(user, id, dto) {
        const nachweis = await this.findOne(user, id);
        if (!user.roles.some(r => r === Role.ausbilder || r === Role.admin)) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Aktualisieren' });
        }
        const updated = await this.prisma.ausbildungsnachweis.update({
            where: { id },
            data: {
                ...(dto.titel !== undefined ? { titel: dto.titel } : {}),
                ...(dto.inhaltMarkdown !== undefined ? { inhaltMarkdown: dto.inhaltMarkdown } : {}),
            },
        });
        await this.auditService.create(user, { action: 'UPDATE', entity: 'Ausbildungsnachweis', entityId: id, details: `Nachweis ${id} aktualisiert` });
        return this.toResponse(updated);
    }
    async submit(user, id) {
        const nachweis = await this.findOne(user, id);
        if (nachweis.status !== STATUS_ENTWURF) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur Entwürfe können eingereicht werden' });
        }
        const updated = await this.prisma.ausbildungsnachweis.update({
            where: { id }, data: { status: STATUS_EINGEREICHT },
        });
        await this.auditService.create(user, { action: 'SUBMIT', entity: 'Ausbildungsnachweis', entityId: id, details: `Nachweis ${id} eingereicht` });
        return this.toResponse(updated);
    }
    async review(user, id) {
        const nachweis = await this.findOne(user, id);
        if (nachweis.status !== STATUS_EINGEREICHT) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur eingereichte Nachweise können geprüft werden' });
        }
        const updated = await this.prisma.ausbildungsnachweis.update({
            where: { id }, data: { status: STATUS_IN_PRUEFUNG },
        });
        await this.auditService.create(user, { action: 'REVIEW', entity: 'Ausbildungsnachweis', entityId: id, details: `Nachweis ${id} geprüft` });
        return this.toResponse(updated);
    }
    async approve(user, id) {
        const nachweis = await this.findOne(user, id);
        if (nachweis.status !== STATUS_IN_PRUEFUNG) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur in Prüfung befindliche Nachweise können freigegeben werden' });
        }
        const updated = await this.prisma.ausbildungsnachweis.update({
            where: { id }, data: { status: STATUS_VISIERT, signiertVon: user.id, signiertAm: new Date() },
        });
        await this.auditService.create(user, { action: 'APPROVE', entity: 'Ausbildungsnachweis', entityId: id, details: `Nachweis ${id} freigegeben` });
        return this.toResponse(updated);
    }
    async archive(user, id) {
        const nachweis = await this.findOne(user, id);
        if (nachweis.status !== STATUS_VISIERT) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur freigegebene Nachweise können archiviert werden' });
        }
        const updated = await this.prisma.ausbildungsnachweis.update({
            where: { id }, data: { status: STATUS_ARCHIVIERT, archiviertAm: new Date() },
        });
        await this.auditService.create(user, { action: 'ARCHIVE', entity: 'Ausbildungsnachweis', entityId: id, details: `Nachweis ${id} archiviert` });
        return this.toResponse(updated);
    }
    async addComment(user, id, dto) {
        const nachweis = await this.findOne(user, id);
        await this.prisma.ausbildungsnachweisKommentar.create({
            data: { nachweisId: id, authorId: user.id, text: dto.text, art: dto.art ?? 'allgemein' },
        });
        await this.auditService.create(user, { action: 'COMMENT', entity: 'Ausbildungsnachweis', entityId: id, details: `Kommentar zu Nachweis ${id} hinzugefügt` });
        return { success: true };
    }
    async addVersion(user, id, dto) {
        const nachweis = await this.findOne(user, id);
        const versions = await this.prisma.ausbildungsnachweisVersion.findMany({ where: { nachweisId: id }, orderBy: { version: 'desc' }, take: 1 });
        const nextVersion = versions.length > 0 ? versions[0].version + 1 : 1;
        await this.prisma.ausbildungsnachweisVersion.create({
            data: { nachweisId: id, version: nextVersion, inhaltMarkdown: dto.inhaltMarkdown, status: dto.status ?? 'entwurf', erstelltVon: user.id },
        });
        await this.auditService.create(user, { action: 'VERSION', entity: 'Ausbildungsnachweis', entityId: id, details: `Version ${nextVersion} zu Nachweis ${id} erstellt` });
        return { success: true };
    }
    async assertScopedAccess(user, nachweis) {
        if (user.roles.some(r => r === Role.ausbilder || r === Role.admin || r === Role.hr))
            return;
        const visible = await this.scope.getVisibleAzubiIds(user);
        if (visible === 'ALL' || (Array.isArray(visible) && visible.includes(nachweis.azubiId)))
            return;
        throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Kein Zugriff auf diesen Nachweis' });
    }
    toResponse(n) {
        return {
            id: n.id, azubiId: n.azubiId, titel: n.titel,
            inhaltMarkdown: n.inhaltMarkdown, status: n.status,
            signiertVon: n.signiertVon, signiertAm: n.signiertAm, archiviertAm: n.archiviertAm,
            rahmenlehrplanId: n.rahmenlehrplanId, erstelltAm: n.erstelltAm, updatedAt: n.updatedAt,
        };
    }
};
AusbildungsnachweisService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService,
        AuditService])
], AusbildungsnachweisService);
export { AusbildungsnachweisService };
//# sourceMappingURL=ausbildungsnachweis.service.js.map