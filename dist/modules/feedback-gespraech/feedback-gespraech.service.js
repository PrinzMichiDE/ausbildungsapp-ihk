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
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let FeedbackGespraechService = class FeedbackGespraechService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    canManage(u) { return u.roles.some(r => r === Role.ausbilder || r === Role.ausbildungsbeauftragter); }
    async create(user, dto) {
        if (!this.canManage(user))
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/Beauftragter' });
        await this.scope.assertCanAccessAzubi(user, dto.azubiId);
        return this.prisma.feedbackGespraech.create({ data: { azubiId: dto.azubiId, durchgefuehrtVonId: user.id, typ: dto.typ, termin: dto.termin ? new Date(dto.termin) : null, ziele: dto.ziele, sichtbarkeitAzubi: dto.sichtbarkeitAzubi ?? true }, include: { vereinbarungen: true } });
    }
    async findAll(user) {
        const where = await this.scopeWhere(user);
        const items = await this.prisma.feedbackGespraech.findMany({ where, include: { vereinbarungen: true }, orderBy: { termin: 'desc' } });
        if (user.roles.includes(Role.azubi))
            return items.filter(i => i.sichtbarkeitAzubi);
        return items;
    }
    async findOne(id, user) {
        const g = await this.prisma.feedbackGespraech.findUnique({ where: { id }, include: { vereinbarungen: true } });
        if (!g)
            throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: 'Gespräch nicht gefunden' });
        await this.scope.assertCanAccessAzubi(user, g.azubiId);
        if (user.roles.includes(Role.azubi) && !g.sichtbarkeitAzubi)
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Kein Zugriff' });
        if (user.roles.includes(Role.hr) && !user.roles.some(r => r === Role.ausbilder))
            return { id: g.id, azubiId: g.azubiId, status: g.status, termin: g.termin };
        return g;
    }
    async update(id, user, dto) {
        const g = await this.findOne(id, user);
        if (!this.canManage(user))
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung' });
        return this.prisma.feedbackGespraech.update({ where: { id }, data: { status: dto.status, verlaufsnotiz: dto.verlaufsnotiz, ziele: dto.ziele, durchgefuehrtAm: dto.durchgefuehrtAm ? new Date(dto.durchgefuehrtAm) : undefined, sichtbarkeitAzubi: dto.sichtbarkeitAzubi }, include: { vereinbarungen: true } });
    }
    async addVereinbarung(id, user, dto) {
        await this.findOne(id, user);
        if (!this.canManage(user) && !user.roles.includes(Role.azubi))
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung' });
        return this.prisma.gespraechVereinbarung.create({ data: { gespraechId: id, text: dto.text, faelligAm: dto.faelligAm ? new Date(dto.faelligAm) : null } });
    }
    async completeVereinbarung(gespraechId, vereinbarungId, user) {
        const v = await this.prisma.gespraechVereinbarung.findUnique({ where: { id: vereinbarungId } });
        if (!v || v.gespraechId !== gespraechId)
            throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: 'Vereinbarung nicht gefunden' });
        return this.prisma.gespraechVereinbarung.update({ where: { id: vereinbarungId }, data: { status: 'erledigt' } });
    }
    async scopeWhere(user) {
        if (user.roles.includes(Role.azubi) && user.azubiId)
            return { azubiId: user.azubiId };
        const visible = await this.scope.getVisibleAzubiIds(user);
        if (visible === 'ALL')
            return {};
        return { azubiId: { in: [...visible] } };
    }
};
FeedbackGespraechService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService, AccessScopeService])
], FeedbackGespraechService);
export { FeedbackGespraechService };
//# sourceMappingURL=feedback-gespraech.service.js.map