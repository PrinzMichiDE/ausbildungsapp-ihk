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
import { FeedbackTyp } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let FeedbackService = class FeedbackService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async create(currentUser, dto) {
        if (dto.typ === FeedbackTyp.azubi_feedback) {
            if (!currentUser.roles.includes(Role.azubi)) {
                throw new ForbiddenException({
                    errorCode: ERROR_CODES.ACCESS_DENIED,
                    message: 'Nur Azubis dürfen Azubi-Feedback geben',
                });
            }
        }
        else {
            const allowed = currentUser.roles.some((r) => r === Role.ausbildungsbeauftragter || r === Role.ausbilder);
            if (!allowed) {
                throw new ForbiddenException({
                    errorCode: ERROR_CODES.ACCESS_DENIED,
                    message: 'Nur Ausbildungsbeauftragte/Ausbilder dürfen bewerten',
                });
            }
            if (dto.anUserId) {
                await this.scope.assertCanAccessAzubi(currentUser, dto.anUserId);
            }
        }
        const feedback = await this.prisma.feedback.create({
            data: {
                vonUserId: currentUser.id,
                anUserId: dto.anUserId,
                abteilungId: dto.abteilungId,
                typ: dto.typ,
                fachkompetenz: dto.fachkompetenz,
                softskills: dto.softskills,
                kommentar: dto.kommentar,
            },
        });
        return this.toResponse(feedback);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.feedback.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return items.map((f) => this.toResponse(f));
    }
    async findOne(id, currentUser) {
        const feedback = await this.prisma.feedback.findUnique({ where: { id } });
        if (!feedback) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.FEEDBACK_NOT_FOUND,
                message: `Feedback ${id} nicht gefunden`,
            });
        }
        this.assertVisible(currentUser, feedback);
        return this.toResponse(feedback);
    }
    async remove(id, currentUser) {
        const feedback = await this.prisma.feedback.findUnique({ where: { id } });
        if (!feedback) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.FEEDBACK_NOT_FOUND,
                message: `Feedback ${id} nicht gefunden`,
            });
        }
        if (feedback.vonUserId !== currentUser.id && !this.isPrivileged(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung',
            });
        }
        await this.prisma.feedback.delete({ where: { id } });
    }
    assertVisible(currentUser, feedback) {
        if (feedback.vonUserId === currentUser.id) {
            return;
        }
        if (this.isPrivileged(currentUser)) {
            return;
        }
        if (currentUser.roles.includes(Role.azubi) &&
            feedback.anUserId === currentUser.azubiId) {
            return;
        }
        throw new ForbiddenException({
            errorCode: ERROR_CODES.ACCESS_DENIED,
            message: 'Kein Zugriff auf dieses Feedback',
        });
    }
    async scopeWhere(currentUser) {
        if (this.isPrivileged(currentUser)) {
            const visible = await this.scope.getVisibleAzubiIds(currentUser);
            if (visible === 'ALL') {
                return {};
            }
            return {
                OR: [
                    { vonUserId: currentUser.id },
                    { anUserId: { in: [...visible] } },
                ],
            };
        }
        return { vonUserId: currentUser.id };
    }
    isPrivileged(user) {
        return user.roles.some((r) => r === Role.ausbilder ||
            r === Role.ausbildungsbeauftragter ||
            r === Role.hr);
    }
    toResponse(f) {
        return {
            id: f.id,
            vonUserId: f.vonUserId,
            anUserId: f.anUserId,
            abteilungId: f.abteilungId,
            typ: f.typ,
            fachkompetenz: f.fachkompetenz,
            softskills: f.softskills,
            kommentar: f.kommentar,
        };
    }
};
FeedbackService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], FeedbackService);
export { FeedbackService };
//# sourceMappingURL=feedback.service.js.map