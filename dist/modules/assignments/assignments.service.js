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
let EinsatzService = class EinsatzService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(dto) {
        const azubi = await this.prisma.user.findUnique({
            where: { id: dto.azubiId },
        });
        if (!azubi) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.USER_NOT_FOUND,
                message: `Azubi ${dto.azubiId} nicht gefunden`,
            });
        }
        const einsatz = await this.prisma.einsatz.create({
            data: {
                azubiId: dto.azubiId,
                abteilungId: dto.abteilungId,
                von: new Date(dto.von),
                bis: new Date(dto.bis),
                skillLevel: dto.skillLevel ?? 0,
            },
        });
        return this.toResponse(einsatz);
    }
    async findAll(currentUser) {
        const where = await this.buildScopeWhere(currentUser);
        const einsaetze = await this.prisma.einsatz.findMany({
            where,
            include: { azubi: true, abteilung: true },
            orderBy: { von: 'asc' },
        });
        return einsaetze.map((e) => ({
            ...this.toResponse(e),
            azubiName: `${e.azubi.firstName} ${e.azubi.lastName}`,
            abteilungName: e.abteilung.name,
        }));
    }
    async findOne(id, currentUser) {
        const einsatz = await this.prisma.einsatz.findUnique({ where: { id } });
        if (!einsatz) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.EINSAZ_NOT_FOUND,
                message: `Einsatz ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, einsatz.azubiId);
        return this.toResponse(einsatz);
    }
    async update(id, dto, currentUser) {
        this.assertAusbilder(currentUser);
        await this.findOne(id, currentUser);
        const einsatz = await this.prisma.einsatz.update({
            where: { id },
            data: {
                ...(dto.abteilungId ? { abteilungId: dto.abteilungId } : {}),
                ...(dto.von ? { von: new Date(dto.von) } : {}),
                ...(dto.bis ? { bis: new Date(dto.bis) } : {}),
                ...(dto.skillLevel !== undefined ? { skillLevel: dto.skillLevel } : {}),
            },
        });
        return this.toResponse(einsatz);
    }
    async remove(id, currentUser) {
        this.assertAusbilder(currentUser);
        await this.findOne(id, currentUser);
        await this.prisma.einsatz.delete({ where: { id } });
    }
    async getPlan(currentUser) {
        const where = await this.buildScopeWhere(currentUser);
        const now = new Date();
        return this.prisma.einsatz.findMany({
            where: { ...where, bis: { gte: now } },
            include: { azubi: true, abteilung: true },
            orderBy: [{ von: 'asc' }, { abteilungId: 'asc' }],
        });
    }
    async buildScopeWhere(currentUser) {
        if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
            return { azubiId: currentUser.azubiId };
        }
        const visible = await this.scope.getVisibleAzubiIds(currentUser);
        if (visible === 'ALL') {
            return {};
        }
        return { azubiId: { in: [...visible] } };
    }
    assertAusbilder(currentUser) {
        if (!currentUser.roles.includes(Role.ausbilder)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder dürfen Einsätze verwalten',
            });
        }
    }
    toResponse(einsatz) {
        return {
            id: einsatz.id,
            azubiId: einsatz.azubiId,
            abteilungId: einsatz.abteilungId,
            von: einsatz.von,
            bis: einsatz.bis,
            skillLevel: einsatz.skillLevel,
        };
    }
};
EinsatzService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], EinsatzService);
export { EinsatzService };
//# sourceMappingURL=assignments.service.js.map