var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let GamificationService = class GamificationService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async createBadge(dto) {
        const badge = await this.prisma.badge.create({ data: dto });
        return this.toBadge(badge);
    }
    async listBadges() {
        const badges = await this.prisma.badge.findMany({ orderBy: { titel: 'asc' } });
        return badges.map((b) => this.toBadge(b));
    }
    async listUserBadges(currentUser, azubiId) {
        const target = await this.resolveTarget(currentUser, azubiId);
        const userBadges = await this.prisma.userBadge.findMany({
            where: { azubiId: target },
            include: { badge: true },
            orderBy: { earnedAt: 'desc' },
        });
        return userBadges.map((ub) => this.toUserBadge(ub));
    }
    async awardBadge(currentUser, azubiId, schluessel) {
        if (!this.canAward(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/Admin dürfen Badges vergeben',
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, azubiId);
        const badge = await this.prisma.badge.findUnique({
            where: { schluessel },
        });
        if (!badge) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.BADGE_NOT_FOUND,
                message: `Badge ${schluessel} nicht gefunden`,
            });
        }
        const existing = await this.prisma.userBadge.findUnique({
            where: { azubiId_badgeId: { azubiId, badgeId: badge.id } },
        });
        if (existing) {
            throw new ConflictException({
                errorCode: ERROR_CODES.CONFLICT,
                message: 'Badge bereits vergeben',
            });
        }
        const userBadge = await this.prisma.userBadge.create({
            data: { azubiId, badgeId: badge.id },
            include: { badge: true },
        });
        return this.toUserBadge(userBadge);
    }
    async resolveTarget(currentUser, requested) {
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
                    message: 'Azubis sehen nur eigene Badges',
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
    canAward(user) {
        return user.roles.some((r) => r === Role.ausbilder || r === Role.admin);
    }
    toBadge(b) {
        return {
            id: b.id,
            schluessel: b.schluessel,
            titel: b.titel,
            beschreibung: b.beschreibung,
            icon: b.icon,
        };
    }
    toUserBadge(ub) {
        return {
            id: ub.id,
            azubiId: ub.azubiId,
            earnedAt: ub.earnedAt,
            badge: this.toBadge(ub.badge),
        };
    }
};
GamificationService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], GamificationService);
export { GamificationService };
//# sourceMappingURL=gamification.service.js.map