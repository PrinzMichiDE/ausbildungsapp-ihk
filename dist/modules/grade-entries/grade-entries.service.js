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
let GradeentryService = class GradeentryService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(currentUser, dto) {
        const azubiId = dto.azubiId ?? currentUser.azubiId;
        if (!azubiId) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'azubiId ist erforderlich',
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, azubiId);
        const entry = await this.prisma.gradeEntry.create({
            data: {
                azubiId,
                fach: dto.fach,
                halbjahr: dto.halbjahr ?? null,
                note: dto.note,
                datum: dto.datum ?? null,
                pruefungsart: dto.pruefungsart ?? null,
                gewichtung: dto.gewichtung ?? 1.0,
                zeugnisUrl: dto.zeugnisUrl ?? null,
            },
        });
        return this.toResponse(entry);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.gradeEntry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return items.map((e) => this.toResponse(e));
    }
    async findOne(id, currentUser) {
        const entry = await this.prisma.gradeEntry.findUnique({ where: { id } });
        if (!entry) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `GradeEntry ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, entry.azubiId);
        return this.toResponse(entry);
    }
    async update(id, currentUser, dto) {
        const entry = await this.prisma.gradeEntry.findUnique({ where: { id } });
        if (!entry) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `GradeEntry ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, entry.azubiId);
        const updated = await this.prisma.gradeEntry.update({
            where: { id },
            data: {
                ...(dto.fach !== undefined ? { fach: dto.fach } : {}),
                ...(dto.halbjahr !== undefined ? { halbjahr: dto.halbjahr } : {}),
                ...(dto.note !== undefined ? { note: dto.note } : {}),
                ...(dto.datum !== undefined ? { datum: dto.datum } : {}),
                ...(dto.pruefungsart !== undefined ? { pruefungsart: dto.pruefungsart } : {}),
                ...(dto.gewichtung !== undefined ? { gewichtung: dto.gewichtung } : {}),
                ...(dto.zeugnisUrl !== undefined ? { zeugnisUrl: dto.zeugnisUrl } : {}),
            },
        });
        return this.toResponse(updated);
    }
    async remove(id, currentUser) {
        const entry = await this.prisma.gradeEntry.findUnique({ where: { id } });
        if (!entry) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `GradeEntry ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, entry.azubiId);
        await this.prisma.gradeEntry.delete({ where: { id } });
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
    toResponse(e) {
        return {
            id: e.id,
            azubiId: e.azubiId,
            fach: e.fach,
            halbjahr: e.halbjahr,
            note: e.note,
            datum: e.datum,
            pruefungsart: e.pruefungsart,
            gewichtung: e.gewichtung ?? 1.0,
            zeugnisUrl: e.zeugnisUrl,
            createdAt: e.createdAt,
        };
    }
};
GradeentryService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], GradeentryService);
export { GradeentryService };
//# sourceMappingURL=grade-entries.service.js.map