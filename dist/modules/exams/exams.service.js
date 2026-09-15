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
let PruefungService = class PruefungService {
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
        const pruefung = await this.prisma.pruefung.create({
            data: {
                azubiId,
                typ: 'ap2',
                status: 'angemeldet',
                beschreibung: dto.beschreibung ?? null,
                ihkTermin: dto.ihkTermin ? new Date(dto.ihkTermin) : null,
            },
        });
        return this.toResponse(pruefung);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.pruefung.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { meilensteine: true },
        });
        return items.map((p) => this.toResponse(p));
    }
    async findOne(id, currentUser) {
        const pruefung = await this.prisma.pruefung.findUnique({
            where: { id },
            include: { meilensteine: true },
        });
        if (!pruefung) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.PRUEFUNG_NOT_FOUND,
                message: `Prüfung ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, pruefung.azubiId);
        return this.toResponse(pruefung);
    }
    async update(id, currentUser, dto) {
        const pruefung = await this.findOne(id, currentUser);
        if (pruefung.status !== 'angemeldet') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PRUEFUNG_NOT_FOUND,
                message: 'Nur angemeldete Prüfungen können bearbeitet werden',
            });
        }
        const updated = await this.prisma.pruefung.update({
            where: { id },
            data: {
                ...(dto.beschreibung !== undefined
                    ? { beschreibung: dto.beschreibung }
                    : {}),
                ...(dto.ihkTermin !== undefined
                    ? { ihkTermin: dto.ihkTermin ? new Date(dto.ihkTermin) : null }
                    : {}),
            },
        });
        return this.toResponse(updated);
    }
    async addMeilenstein(pruefungId, currentUser, dto) {
        const _pruefung = await this.findOne(pruefungId, currentUser);
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR/Admin dürfen Meilensteine anlegen',
            });
        }
        const meilenstein = await this.prisma.pruefungsMeilenstein.create({
            data: {
                pruefungId,
                titel: dto.titel,
                beschreibung: dto.beschreibung ?? null,
                faelligAm: dto.faelligAm ? new Date(dto.faelligAm) : null,
            },
        });
        return this.toMeilensteinResponse(meilenstein);
    }
    async updateMeilenstein(pruefungId, meilensteinId, currentUser, dto) {
        const meilenstein = await this.prisma.pruefungsMeilenstein.findUnique({
            where: { id: meilensteinId },
        });
        if (!meilenstein) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.PRUEFUNGS_MEILENSTEIN_NOT_FOUND,
                message: `Meilenstein ${meilensteinId} nicht gefunden`,
            });
        }
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR/Admin dürfen Meilensteine bearbeiten',
            });
        }
        const updated = await this.prisma.pruefungsMeilenstein.update({
            where: { id: meilensteinId },
            data: {
                ...(dto.titel !== undefined ? { titel: dto.titel } : {}),
                ...(dto.beschreibung !== undefined
                    ? { beschreibung: dto.beschreibung }
                    : {}),
                ...(dto.faelligAm !== undefined
                    ? { faelligAm: dto.faelligAm ? new Date(dto.faelligAm) : null }
                    : {}),
            },
        });
        return this.toMeilensteinResponse(updated);
    }
    async completeMeilenstein(pruefungId, meilensteinId, currentUser) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR/Admin dürfen Meilensteine vervollständigen',
            });
        }
        const meilenstein = await this.prisma.pruefungsMeilenstein.findUnique({
            where: { id: meilensteinId },
        });
        if (!meilenstein) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.PRUEFUNGS_MEILENSTEIN_NOT_FOUND,
                message: `Meilenstein ${meilensteinId} nicht gefunden`,
            });
        }
        const updated = await this.prisma.pruefungsMeilenstein.update({
            where: { id: meilensteinId },
            data: {
                erledigt: true,
                erledigtAm: new Date(),
            },
        });
        return this.toMeilensteinResponse(updated);
    }
    async statusChange(id, currentUser, status) {
        const _pruefung = await this.findOne(id, currentUser);
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR/Admin dürfen den Status ändern',
            });
        }
        const validStatuses = [
            'angemeldet',
            'teilgenommen',
            'bestanden',
            'wiederholung',
        ];
        if (!validStatuses.includes(status)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.BAD_REQUEST,
                message: `Ungültiger Status. Erlaubt: ${validStatuses.join(', ')}`,
            });
        }
        const updated = await this.prisma.pruefung.update({
            where: { id },
            data: { status: status },
        });
        return this.toResponse(updated);
    }
    async remove(id, currentUser) {
        const pruefung = await this.findOne(id, currentUser);
        if (pruefung.status !== 'angemeldet') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.PRUEFUNG_NOT_FOUND,
                message: 'Nur angemeldete Prüfungen können gelöscht werden',
            });
        }
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        await this.prisma.pruefung.delete({ where: { id } });
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
    toResponse(p) {
        return {
            id: p.id,
            azubiId: p.azubiId,
            typ: p.typ,
            status: p.status,
            beschreibung: p.beschreibung,
            ihkTermin: p.ihkTermin,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        };
    }
    toMeilensteinResponse(m) {
        return {
            id: m.id,
            pruefungId: m.pruefungId,
            titel: m.titel,
            beschreibung: m.beschreibung,
            faelligAm: m.faelligAm,
            erledigt: m.erledigt,
            erledigtAm: m.erledigtAm,
            createdAt: m.createdAt,
            updatedAt: m.updatedAt,
        };
    }
};
PruefungService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], PruefungService);
export { PruefungService };
//# sourceMappingURL=exams.service.js.map