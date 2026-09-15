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
let OnboardingService = class OnboardingService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(currentUser, dto) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/Admin dürfen Checklisten anlegen',
            });
        }
        const azubiId = dto.azubiId ?? currentUser.azubiId;
        if (!azubiId) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.BAD_REQUEST,
                message: 'azubiId ist erforderlich',
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, azubiId);
        const checklist = await this.prisma.checklist.create({
            data: {
                azubiId,
                titel: dto.titel,
                items: {
                    create: dto.items.map((text, index) => ({
                        text,
                        reihenfolge: index,
                    })),
                },
            },
            include: { items: true },
        });
        return this.toResponse(checklist);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.checklist.findMany({
            where,
            include: { items: { orderBy: { reihenfolge: 'asc' } } },
        });
        return items.map((c) => this.toResponse(c));
    }
    async findOne(id, currentUser) {
        const checklist = await this.prisma.checklist.findUnique({
            where: { id },
            include: { items: { orderBy: { reihenfolge: 'asc' } } },
        });
        if (!checklist) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
                message: `Checkliste ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, checklist.azubiId);
        return this.toResponse(checklist);
    }
    async updateItem(id, itemId, currentUser, dto) {
        const checklist = await this.prisma.checklist.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!checklist) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
                message: `Checkliste ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, checklist.azubiId);
        const isOwner = currentUser.roles.includes(Role.azubi) &&
            checklist.azubiId === currentUser.azubiId;
        if (!isOwner && !this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        const item = checklist.items.find((i) => i.id === itemId);
        if (!item) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
                message: `Item ${itemId} nicht gefunden`,
            });
        }
        await this.prisma.checklistItem.update({
            where: { id: itemId },
            data: { erledigt: dto.erledigt },
        });
        return this.findOne(id, currentUser);
    }
    async remove(id, currentUser) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/Admin dürfen Checklisten löschen',
            });
        }
        const checklist = await this.prisma.checklist.findUnique({ where: { id } });
        if (!checklist) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
                message: `Checkliste ${id} nicht gefunden`,
            });
        }
        await this.prisma.checklist.delete({ where: { id } });
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
        return user.roles.some((r) => r === Role.ausbilder || r === Role.admin);
    }
    toResponse(c) {
        const allDone = c.items.length > 0 && c.items.every((i) => i.erledigt);
        return {
            id: c.id,
            azubiId: c.azubiId,
            titel: c.titel,
            erledigt: allDone,
            items: c.items.map((i) => ({
                id: i.id,
                text: i.text,
                erledigt: i.erledigt,
                reihenfolge: i.reihenfolge,
            })),
        };
    }
};
OnboardingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], OnboardingService);
export { OnboardingService };
//# sourceMappingURL=onboarding.service.js.map