var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let ProjektService = class ProjektService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(currentUser, dto) {
        const azubiId = currentUser.azubiId;
        if (!azubiId) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Kein Azubi-Profil',
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, azubiId);
        const projekt = await this.prisma.projekt.create({
            data: {
                azubiId,
                titel: dto.titel,
                beschreibung: dto.beschreibung ?? null,
                projektantrag: dto.projektantrag ?? null,
                projektdoku: dto.projektdoku ?? null,
                status: 'entwurf',
                freigegeben: false,
            },
        });
        return this.toResponse(projekt);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.projekt.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return items.map((p) => this.toResponse(p));
    }
    async findOne(id, currentUser) {
        const projekt = await this.prisma.projekt.findUnique({ where: { id } });
        if (!projekt) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
                message: `Projekt ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, projekt.azubiId);
        return this.toResponse(projekt);
    }
    async update(id, currentUser, dto) {
        const projekt = await this.findOne(id, currentUser);
        const isOwner = currentUser.roles.includes(Role.azubi) &&
            projekt.azubiId === currentUser.azubiId;
        if (!isOwner && !this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        if (projekt.status !== 'entwurf' && projekt.status !== 'abgelehnt') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
                message: 'Projekt kann in diesem Status nicht bearbeitet werden',
            });
        }
        const updated = await this.prisma.projekt.update({
            where: { id },
            data: {
                ...(dto.titel ? { titel: dto.titel } : {}),
                ...(dto.beschreibung !== undefined ? { beschreibung: dto.beschreibung } : {}),
                ...(dto.projektantrag !== undefined ? { projektantrag: dto.projektantrag } : {}),
                ...(dto.projektdoku !== undefined ? { projektdoku: dto.projektdoku } : {}),
            },
        });
        return this.toResponse(updated);
    }
    async submit(id, currentUser) {
        const projekt = await this.findOne(id, currentUser);
        const isOwner = currentUser.roles.includes(Role.azubi) &&
            projekt.azubiId === currentUser.azubiId;
        if (!isOwner && !this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur der Azubi oder ein Manager dürfen den Projektantrag einreichen',
            });
        }
        if (projekt.status !== 'entwurf') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
                message: 'Nur Entwürfe können eingereicht werden',
            });
        }
        const updated = await this.prisma.projekt.update({
            where: { id },
            data: { status: 'eingereicht' },
        });
        return this.toResponse(updated);
    }
    async review(id, currentUser, dto) {
        const projekt = await this.findOne(id, currentUser);
        if (!this.canReview(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR/Admin dürfen Projekte reviewen',
            });
        }
        if (projekt.status !== 'eingereicht' && projekt.status !== 'in_pruefung') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
                message: 'Projekt ist nicht zur Prüfung freigegeben',
            });
        }
        const updated = await this.prisma.projekt.update({
            where: { id },
            data: {
                status: dto.status,
                bewertung: dto.bewertung,
                bewertetVon: currentUser.id,
                bewertetAm: new Date(),
                freigegeben: dto.status === 'freigegeben',
            },
        });
        return this.toResponse(updated);
    }
    async requestRevision(id, currentUser) {
        const projekt = await this.findOne(id, currentUser);
        if (!this.canReview(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR/Admin dürfen Überarbeitung anfordern',
            });
        }
        if (projekt.status !== 'eingereicht' && projekt.status !== 'in_pruefung') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
                message: 'Projekt ist nicht zur Prüfung freigegeben',
            });
        }
        const updated = await this.prisma.projekt.update({
            where: { id },
            data: { status: 'in_pruefung' },
        });
        return this.toResponse(updated);
    }
    async archive(id, currentUser) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/Admin dürfen Projekte archivieren',
            });
        }
        await this.prisma.projekt.update({
            where: { id },
            data: { status: 'archiviert' },
        });
    }
    async remove(id, currentUser) {
        const projekt = await this.findOne(id, currentUser);
        if (projekt.status !== 'entwurf' && projekt.status !== 'abgelehnt') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
                message: 'Nur Entwürfe und abgelehnte Projekte können gelöscht werden',
            });
        }
        if (!this.canManage(currentUser) && !(currentUser.roles.includes(Role.azubi) && projekt.azubiId === currentUser.azubiId)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        await this.prisma.projekt.delete({ where: { id } });
    }
    async scopeWhere(currentUser) {
        if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
            return { azubiId: currentUser.azubiId };
        }
        const visible = await this.scope.getVisibleAzubiIds(currentUser);
        if (visible === 'ALL') {
            return {};
        }
        return { azubiId: { in: [...visible] } };
    }
    canManage(user) {
        return user.roles.some((r) => r === Role.ausbilder || r === Role.hr || r === Role.admin);
    }
    canReview(user) {
        return user.roles.some((r) => r === Role.ausbilder || r === Role.hr || r === Role.admin);
    }
    toResponse(p) {
        return {
            id: p.id,
            azubiId: p.azubiId,
            titel: p.titel,
            beschreibung: p.beschreibung,
            projektantrag: p.projektantrag,
            projektdoku: p.projektdoku,
            status: p.status,
            bewertung: p.bewertung,
            bewertetVon: p.bewertetVon,
            bewertetAm: p.bewertetAm,
            freigegeben: p.freigegeben,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        };
    }
};
ProjektService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], ProjektService);
export { ProjektService };
//# sourceMappingURL=projects.service.js.map