var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Role } from '../constants/roles.js';
import { ERROR_CODES } from '../constants/error-codes.js';
const ALLE = 'ALL';
let AccessScopeService = class AccessScopeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVisibleAzubiIds(user) {
        switch (true) {
            case user.roles.includes(Role.azubi):
                return user.azubiId ? [user.azubiId] : [];
            case user.roles.includes(Role.ausbildungsbeauftragter):
                return this.findActiveAzubiIdsForAbteilungen(user.abteilungIds);
            case user.roles.includes(Role.ausbilder):
            case user.roles.includes(Role.hr):
                return ALLE;
            case user.roles.includes(Role.admin):
                return [];
            default:
                return [];
        }
    }
    async findActiveAzubiIdsForAbteilungen(abteilungIds) {
        if (!abteilungIds || abteilungIds.length === 0) {
            return [];
        }
        const now = new Date();
        const einsaetze = await this.prisma.einsatz.findMany({
            where: {
                abteilungId: { in: [...abteilungIds] },
                von: { lte: now },
                bis: { gte: now },
            },
            select: { azubiId: true },
            distinct: ['azubiId'],
        });
        return einsaetze.map((e) => e.azubiId);
    }
    async isAzubiVisible(user, azubiId) {
        const scope = await this.getVisibleAzubiIds(user);
        if (scope === ALLE) {
            return true;
        }
        return scope.includes(azubiId);
    }
    async assertCanAccessAzubi(user, azubiId) {
        const visible = await this.isAzubiVisible(user, azubiId);
        if (!visible) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Kein Zugriff auf diesen Auszubildenden',
            });
        }
    }
    async assertCanAccessBericht(user, berichtId) {
        const bericht = await this.prisma.report.findUnique({
            where: { id: berichtId },
            select: { azubiId: true },
        });
        if (!bericht) {
            return;
        }
        await this.assertCanAccessAzubi(user, bericht.azubiId);
    }
};
AccessScopeService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AccessScopeService);
export { AccessScopeService };
//# sourceMappingURL=access-scope.service.js.map