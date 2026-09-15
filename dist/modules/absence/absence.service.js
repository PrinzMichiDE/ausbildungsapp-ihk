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
import { AbwesenheitQuelle } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let AbwesenheitService = class AbwesenheitService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(currentUser, dto) {
        let azubiId;
        if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
            azubiId = currentUser.azubiId;
            if (dto.azubiId && dto.azubiId !== azubiId) {
                throw new ForbiddenException({
                    errorCode: ERROR_CODES.ACCESS_DENIED,
                    message: 'Azubis dürfen nur eigene Abwesenheiten erfassen',
                });
            }
        }
        else {
            if (!dto.azubiId) {
                throw new ForbiddenException({
                    errorCode: ERROR_CODES.BAD_REQUEST,
                    message: 'azubiId ist erforderlich',
                });
            }
            await this.scope.assertCanAccessAzubi(currentUser, dto.azubiId);
            azubiId = dto.azubiId;
        }
        const abwesenheit = await this.prisma.abwesenheit.create({
            data: {
                azubiId,
                typ: dto.typ,
                quelle: dto.quelle ?? AbwesenheitQuelle.manuell,
                von: new Date(dto.von),
                bis: new Date(dto.bis),
                notiz: dto.notiz,
            },
        });
        return this.toResponse(abwesenheit);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.abwesenheit.findMany({
            where,
            orderBy: { von: 'desc' },
        });
        return items.map((a) => this.toResponse(a));
    }
    async findOne(id, currentUser) {
        const abwesenheit = await this.prisma.abwesenheit.findUnique({
            where: { id },
        });
        if (!abwesenheit) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.ABWESENHEIT_NOT_FOUND,
                message: `Abwesenheit ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, abwesenheit.azubiId);
        return this.toResponse(abwesenheit);
    }
    async update(id, currentUser, dto) {
        const existing = await this.findOne(id, currentUser);
        const isOwner = currentUser.roles.includes(Role.azubi) &&
            existing.azubiId === currentUser.azubiId;
        if (!isOwner && !this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        const updated = await this.prisma.abwesenheit.update({
            where: { id },
            data: {
                ...(dto.typ ? { typ: dto.typ } : {}),
                ...(dto.von ? { von: new Date(dto.von) } : {}),
                ...(dto.bis ? { bis: new Date(dto.bis) } : {}),
                ...(dto.notiz !== undefined ? { notiz: dto.notiz } : {}),
            },
        });
        return this.toResponse(updated);
    }
    async remove(id, currentUser) {
        const existing = await this.findOne(id, currentUser);
        const isOwner = currentUser.roles.includes(Role.azubi) &&
            existing.azubiId === currentUser.azubiId;
        if (!isOwner && !this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        await this.prisma.abwesenheit.delete({ where: { id } });
    }
    async resolveAzubiId(currentUser, requested) {
        if (currentUser.roles.includes(Role.azubi)) {
            if (!currentUser.azubiId) {
                throw new ForbiddenException({
                    errorCode: ERROR_CODES.ACCESS_DENIED,
                    message: 'Kein Azubi-Profil',
                });
            }
            if (requested && requested !== currentUser.azubiId) {
                throw new ForbiddenException({
                    errorCode: ERROR_CODES.ACCESS_DENIED,
                    message: 'Azubis dürfen nur eigene Abwesenheiten erfassen',
                });
            }
            return currentUser.azubiId;
        }
        if (!requested) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.BAD_REQUEST,
                message: 'azubiId ist erforderlich',
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, requested);
        return requested;
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
    toResponse(a) {
        return {
            id: a.id,
            azubiId: a.azubiId,
            typ: a.typ,
            quelle: a.quelle,
            von: a.von,
            bis: a.bis,
            notiz: a.notiz,
        };
    }
};
AbwesenheitService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], AbwesenheitService);
export { AbwesenheitService };
//# sourceMappingURL=absence.service.js.map