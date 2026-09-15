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
let ZertifikateService = class ZertifikateService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(currentUser, dto) {
        const azubiId = await this.resolveAzubiId(currentUser, dto.azubiId);
        const zertifikat = await this.prisma.zertifikat.create({
            data: {
                azubiId,
                titel: dto.titel,
                aussteller: dto.aussteller,
                erworbenAm: new Date(dto.erworbenAm),
                dokumentUrl: dto.dokumentUrl,
            },
        });
        return this.toResponse(zertifikat);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.zertifikat.findMany({
            where,
            orderBy: { erworbenAm: 'desc' },
        });
        return items.map((z) => this.toResponse(z));
    }
    async findOne(id, currentUser) {
        const zertifikat = await this.prisma.zertifikat.findUnique({
            where: { id },
        });
        if (!zertifikat) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.ZERTIFIKAT_NOT_FOUND,
                message: `Zertifikat ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, zertifikat.azubiId);
        return this.toResponse(zertifikat);
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
        const updated = await this.prisma.zertifikat.update({
            where: { id },
            data: {
                ...(dto.titel ? { titel: dto.titel } : {}),
                ...(dto.aussteller ? { aussteller: dto.aussteller } : {}),
                ...(dto.erworbenAm ? { erworbenAm: new Date(dto.erworbenAm) } : {}),
                ...(dto.dokumentUrl !== undefined ? { dokumentUrl: dto.dokumentUrl } : {}),
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
        await this.prisma.zertifikat.delete({ where: { id } });
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
                    message: 'Azubis dürfen nur eigene Zertifikate anlegen',
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
    toResponse(z) {
        return {
            id: z.id,
            azubiId: z.azubiId,
            titel: z.titel,
            aussteller: z.aussteller,
            erworbenAm: z.erworbenAm,
            dokumentUrl: z.dokumentUrl,
        };
    }
};
ZertifikateService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], ZertifikateService);
export { ZertifikateService };
//# sourceMappingURL=certificates.service.js.map