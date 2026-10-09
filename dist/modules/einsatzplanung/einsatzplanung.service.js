var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EinsatzplanungService_1;
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService, ALLE } from '../../common/rbac/access-scope.service.js';
let EinsatzplanungService = EinsatzplanungService_1 = class EinsatzplanungService {
    prisma;
    accessScope;
    logger = new Logger(EinsatzplanungService_1.name);
    constructor(prisma, accessScope) {
        this.prisma = prisma;
        this.accessScope = accessScope;
    }
    async findAll(dto, currentUser) {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const skip = (page - 1) * limit;
        let azubiFilter;
        if (dto.azubiId) {
            const visibleAzubis = await this.accessScope.getVisibleAzubiIds(currentUser);
            azubiFilter = {
                azubiId: { in: visibleAzubis === ALLE ? [] : [...visibleAzubis] },
            };
        }
        else {
            const visibleAzubis = await this.accessScope.getVisibleAzubiIds(currentUser);
            azubiFilter = {
                azubiId: { in: visibleAzubis === ALLE ? [] : [...visibleAzubis] },
            };
        }
        const where = {
            ...azubiFilter,
            ...(dto.status && { status: dto.status }),
            ...(dto.von && {
                von: {
                    gte: new Date(dto.von),
                },
            }),
            ...(dto.bis && {
                bis: {
                    lte: new Date(dto.bis),
                },
            }),
        };
        const total = await this.prisma.einsatz.count({ where });
        const einsaetze = await this.prisma.einsatz.findMany({
            where,
            skip,
            take: limit,
            orderBy: { von: 'desc' },
            include: {
                azubi: {
                    select: {
                        id: true,
                        vorname: true,
                        nachname: true,
                        email: true,
                    },
                },
                abteilung: {
                    select: {
                        id: true,
                        bezeichnung: true,
                        kurzzeichen: true,
                    },
                },
            },
        });
        return {
            data: einsaetze,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id, currentUser) {
        const einsatz = await this.prisma.einsatz.findUnique({
            where: { id },
            include: {
                azubi: {
                    select: {
                        id: true,
                        vorname: true,
                        nachname: true,
                        email: true,
                    },
                },
                abteilung: {
                    select: {
                        id: true,
                        bezeichnung: true,
                        kurzzeichen: true,
                    },
                },
            },
        });
        if (!einsatz) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        const visibleAzubiIds = await this.accessScope.getVisibleAzubiIds(currentUser);
        if (visibleAzubiIds !== ALLE && !visibleAzubiIds.includes(einsatz.azubiId)) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        return einsatz;
    }
    async create(dto, currentUser) {
        if (dto.von >= dto.bis) {
            throw new Error('Das Startdatum (von) muss vor dem Enddatum (bis) liegen');
        }
        const visibleAzubiIds = await this.accessScope.getVisibleAzubiIds(currentUser);
        if (dto.azubiId && !visibleAzubiIds.includes(dto.azubiId)) {
            throw new Error('Der zugewiesene Azubi ist für diesen Benutzer nicht sichtbar');
        }
        const einsatz = await this.prisma.einsatz.create({
            data: {
                azubiId: dto.azubiId,
                abteilungId: dto.abteilungId,
                von: new Date(dto.von),
                bis: new Date(dto.bis),
                status: dto.status ?? 'geplant',
                bemerkung: dto.kommentar,
            },
            include: {
                azubi: {
                    select: {
                        id: true,
                        vorname: true,
                        nachname: true,
                        email: true,
                    },
                },
                abteilung: {
                    select: {
                        id: true,
                        bezeichnung: true,
                        kurzzeichen: true,
                    },
                },
            },
        });
        this.logger.log(`Neuer Einsatz erstellt: ${einsatz.id}`);
        return einsatz;
    }
    async update(id, dto, currentUser) {
        const existing = await this.prisma.einsatz.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        const visibleAzubiIds = await this.accessScope.getVisibleAzubiIds(currentUser);
        if (!visibleAzubiIds.includes(existing.azubiId)) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        const von = dto.von ?? existing.von;
        const bis = dto.bis ?? existing.bis;
        if (von >= bis) {
            throw new Error('Das Startdatum (von) muss vor dem Enddatum (bis) liegen');
        }
        const azubiId = dto.azubiId ?? existing.azubiId;
        if (dto.azubiId && !visibleAzubiIds.includes(azubiId)) {
            throw new Error('Der zugewiesene Azubi ist für diesen Benutzer nicht sichtbar');
        }
        const einsatz = await this.prisma.einsatz.update({
            where: { id },
            data: {
                ...(dto.azubiId && { azubiId: dto.azubiId }),
                ...(dto.abteilungId && { abteilungId: dto.abteilungId }),
                ...(dto.von && { von: new Date(dto.von) }),
                ...(dto.bis && { bis: new Date(dto.bis) }),
                ...(dto.status && { status: dto.status }),
                ...(dto.kommentar !== undefined && { bemerkung: dto.kommentar }),
            },
            include: {
                azubi: {
                    select: {
                        id: true,
                        vorname: true,
                        nachname: true,
                        email: true,
                    },
                },
                abteilung: {
                    select: {
                        id: true,
                        bezeichnung: true,
                        kurzzeichen: true,
                    },
                },
            },
        });
        this.logger.log(`Einsatzplanung aktualisiert: ${einsatz.id}`);
        return einsatz;
    }
    async remove(id, currentUser) {
        const existing = await this.prisma.einsatz.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        const visibleAzubiIds = [
            ...await this.accessScope.getVisibleAzubiIds(currentUser),
        ];
        if (!visibleAzubiIds.includes(existing.azubiId)) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        await this.prisma.einsatz.delete({ where: { id } });
        this.logger.log(`Einsatzplanung gelöscht: ${id}`);
        return { deleted: id };
    }
    async getCalendarView(dto, currentUser) {
        if (!dto.von || !dto.bis) {
            throw new Error('Für die Kalenderansicht werden von und bis benötigt');
        }
        const visibleAzubiIds = [
            ...await this.accessScope.getVisibleAzubiIds(currentUser),
        ];
        const azubiFilter = dto.azubiId
            ? { azubiId: dto.azubiId }
            : {};
        const where = {
            ...azubiFilter,
            ...(dto.status && { status: dto.status }),
            OR: [
                {
                    von: { gte: new Date(dto.von), lte: new Date(dto.bis) },
                },
                {
                    bis: { gte: new Date(dto.von), lte: new Date(dto.bis) },
                },
                {
                    von: { lte: new Date(dto.von) },
                    bis: { gte: new Date(dto.bis) },
                },
            ],
        };
        const einsaetze = await this.prisma.einsatz.findMany({
            where,
            orderBy: { von: 'asc' },
            include: {
                azubi: {
                    select: {
                        id: true,
                        vorname: true,
                        nachname: true,
                    },
                },
                abteilung: {
                    select: {
                        id: true,
                        bezeichnung: true,
                        kurzzeichen: true,
                    },
                },
            },
        });
        return { data: einsaetze };
    }
    async assignUser(id, dto, currentUser) {
        const existing = await this.prisma.einsatz.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        const visibleAzubiIds = await this.accessScope.getVisibleAzubiIds(currentUser);
        if (!visibleAzubiIds.includes(existing.azubiId)) {
            throw new NotFoundException(`Einsatzplanung mit ID ${id} nicht gefunden`);
        }
        if (!visibleAzubiIds.includes(dto.azubiId)) {
            throw new Error('Der zugewiesene Azubi ist für diesen Benutzer nicht sichtbar');
        }
        const einsatz = await this.prisma.einsatz.update({
            where: { id },
            data: { azubiId: dto.azubiId },
            include: {
                azubi: {
                    select: {
                        id: true,
                        vorname: true,
                        nachname: true,
                        email: true,
                    },
                },
                abteilung: {
                    select: {
                        id: true,
                        bezeichnung: true,
                        kurzzeichen: true,
                    },
                },
            },
        });
        this.logger.log(`User zugewiesen zu Einsatz ${id}: ${dto.azubiId}`);
        return einsatz;
    }
    async getUserAssignments(einsatzId, currentUser) {
        const existing = await this.prisma.einsatz.findUnique({
            where: { id: einsatzId },
            include: { azubi: true },
        });
        if (!existing) {
            throw new NotFoundException(`Einsatzplanung mit ID ${einsatzId} nicht gefunden`);
        }
        const visibleAzubiIds = await this.accessScope.getVisibleAzubiIds(currentUser);
        if (![...visibleAzubiIds].includes(existing.azubiId)) {
            throw new NotFoundException(`Einsatzplanung mit ID ${einsatzId} nicht gefunden`);
        }
        return {
            data: {
                azubiId: existing.azubiId,
                azubi: existing.azubi,
                abteilungId: existing.abteilungId,
                von: existing.von,
                bis: existing.bis,
            },
        };
    }
};
EinsatzplanungService = EinsatzplanungService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], EinsatzplanungService);
export { EinsatzplanungService };
//# sourceMappingURL=einsatzplanung.service.js.map