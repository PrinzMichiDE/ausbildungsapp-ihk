var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DatenschutzService_1;
import { ForbiddenException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ConsentAction, DatenschutzRequestStatus, ReportStatus, } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { AuditService } from '../audit/audit.service.js';
const REQUEST_DUE_DAYS = 30;
let DatenschutzService = DatenschutzService_1 = class DatenschutzService {
    prisma;
    scope;
    audit;
    logger = new Logger(DatenschutzService_1.name);
    constructor(prisma, scope, audit) {
        this.prisma = prisma;
        this.scope = scope;
        this.audit = audit;
    }
    async createRequest(currentUser, dto) {
        let targetUserId = currentUser.id;
        if (dto.azubiId && dto.azubiId !== currentUser.id) {
            this.assertProcessor(currentUser, 'Antrag für andere anlegen');
            await this.scope.assertCanAccessAzubi(currentUser, dto.azubiId);
            targetUserId = dto.azubiId;
        }
        else if (!currentUser.roles.includes(Role.azubi)) {
            this.assertProcessor(currentUser, 'Antrag für sich selbst anlegen');
        }
        const now = new Date();
        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + REQUEST_DUE_DAYS);
        const request = await this.prisma.datenschutzRequest.create({
            data: {
                userId: targetUserId,
                typ: dto.typ,
                details: dto.details ?? null,
                requestedAt: now,
                dueDate,
            },
        });
        await this.audit.create(currentUser, {
            action: 'DATA_REQUEST_CREATED',
            entity: 'datenschutz-request',
            entityId: request.id,
            details: JSON.stringify({ userId: targetUserId, typ: dto.typ }),
        });
        return this.toRequestResponse(request);
    }
    async findAllRequests(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.datenschutzRequest.findMany({
            where,
            orderBy: { requestedAt: 'desc' },
        });
        return items.map((r) => this.toRequestResponse(r));
    }
    async findRequest(id, currentUser) {
        const request = await this.loadRequest(id);
        await this.assertCanRead(request.userId, currentUser);
        return this.toRequestResponse(request);
    }
    async processRequest(id, currentUser, dto) {
        this.assertProcessor(currentUser, 'Antrag bearbeiten');
        const request = await this.loadRequest(id);
        const updated = await this.prisma.datenschutzRequest.update({
            where: { id },
            data: {
                status: dto.status,
                result: dto.result ?? request.result,
                processedBy: currentUser.id,
                completedAt: dto.status === DatenschutzRequestStatus.completed ||
                    dto.status === DatenschutzRequestStatus.rejected
                    ? request.completedAt ?? new Date()
                    : null,
            },
        });
        await this.audit.create(currentUser, {
            action: 'DATA_REQUEST_PROCESSED',
            entity: 'datenschutz-request',
            entityId: id,
            details: JSON.stringify({ status: dto.status }),
        });
        return this.toRequestResponse(updated);
    }
    async exportPersonalData(id, currentUser) {
        const request = await this.loadRequest(id);
        if (request.userId !== currentUser.id &&
            !(currentUser.roles.includes(Role.ausbilder) ||
                currentUser.roles.includes(Role.hr) ||
                currentUser.roles.includes(Role.admin))) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Kein Zugriff auf diese Anfrage',
            });
        }
        if (request.userId !== currentUser.id) {
            await this.scope.assertCanAccessAzubi(currentUser, request.userId);
        }
        const userId = request.userId;
        const exportData = await this.collectPersonalData(userId);
        await this.audit.create(currentUser, {
            action: 'DATA_EXPORT',
            entity: 'datenschutz-request',
            entityId: id,
            details: `Export der Daten von user ${userId}`,
        });
        return exportData;
    }
    async anonymize(azubiId, currentUser) {
        this.assertProcessor(currentUser, 'Anonymisierung durchführen');
        await this.scope.assertCanAccessAzubi(currentUser, azubiId);
        const user = await this.prisma.user.findUnique({
            where: { id: azubiId },
            select: { id: true, email: true },
        });
        if (!user) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.USER_NOT_FOUND,
                message: `User ${azubiId} nicht gefunden`,
            });
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.zertifikat.deleteMany({ where: { azubiId } });
            await tx.abwesenheit.deleteMany({ where: { azubiId } });
            await tx.grade.deleteMany({ where: { azubiId } });
            await tx.checklist.deleteMany({ where: { azubiId } });
            await tx.feedback.deleteMany({
                where: { OR: [{ vonUserId: azubiId }, { anUserId: azubiId }] },
            });
            await tx.pruefung.deleteMany({ where: { azubiId } });
            await tx.projekt.deleteMany({ where: { azubiId } });
            const reports = await tx.report.findMany({
                where: { azubiId },
                select: { id: true, status: true },
            });
            const archivedIds = reports
                .filter((r) => r.status === ReportStatus.archiviert)
                .map((r) => r.id);
            const deletableIds = reports
                .filter((r) => r.status !== ReportStatus.archiviert)
                .map((r) => r.id);
            if (archivedIds.length > 0) {
                await tx.reportTask.deleteMany({
                    where: { reportId: { in: archivedIds } },
                });
                await tx.reportComment.deleteMany({
                    where: { reportId: { in: archivedIds } },
                });
                await tx.report.updateMany({
                    where: { id: { in: archivedIds } },
                    data: {
                        inhaltMarkdown: '[anonymisiert]',
                        titel: 'Anonymisierter Bericht',
                    },
                });
            }
            if (deletableIds.length > 0) {
                await tx.report.deleteMany({ where: { id: { in: deletableIds } } });
            }
            await tx.reportComment.deleteMany({ where: { authorId: azubiId } });
            const consents = await tx.consent.findMany({
                where: { userId: azubiId, revokedAt: null },
            });
            for (const consent of consents) {
                await tx.consent.update({
                    where: { id: consent.id },
                    data: { revokedAt: new Date() },
                });
                await tx.consentLog.create({
                    data: {
                        userId: azubiId,
                        key: consent.key,
                        version: consent.version,
                        action: ConsentAction.revoked,
                    },
                });
            }
            await tx.user.update({
                where: { id: azubiId },
                data: {
                    email: `anonym+${randomUUID()}@anonym.local`,
                    firstName: 'Anonym',
                    lastName: 'User',
                    azubiId: null,
                    isActive: false,
                    passwordHash: `!invalid-${randomUUID()}`,
                },
            });
        });
        await this.audit.create(currentUser, {
            action: 'DATA_ANONYMIZED',
            entity: 'user',
            entityId: azubiId,
        });
        this.logger.warn(`User ${azubiId} wurde anonymisiert`);
        return { ok: true, anonymizedUserId: azubiId };
    }
    async findConsents(currentUser) {
        const consents = await this.prisma.consent.findMany({
            where: { userId: currentUser.id },
            orderBy: { grantedAt: 'desc' },
        });
        return consents.map((c) => this.toConsentResponse(c));
    }
    async grantConsent(currentUser, dto, ipAddress) {
        const version = dto.version ?? '1';
        const existing = await this.prisma.consent.findUnique({
            where: {
                userId_key_version: { userId: currentUser.id, key: dto.key, version },
            },
        });
        const consent = await this.prisma.consent.upsert({
            where: {
                userId_key_version: { userId: currentUser.id, key: dto.key, version },
            },
            update: { grantedAt: new Date(), revokedAt: null, text: dto.text ?? null, ipAddress: ipAddress ?? null, source: dto.source ?? 'ui' },
            create: {
                userId: currentUser.id,
                key: dto.key,
                version,
                text: dto.text ?? null,
                grantedAt: new Date(),
                ipAddress: ipAddress ?? null,
                source: dto.source ?? 'ui',
            },
        });
        await this.prisma.consentLog.create({
            data: {
                userId: currentUser.id,
                key: dto.key,
                version,
                action: ConsentAction.granted,
                text: dto.text ?? null,
                ipAddress: ipAddress ?? null,
                source: dto.source ?? 'ui',
            },
        });
        await this.audit.create(currentUser, {
            action: 'CONSENT_GRANTED',
            entity: 'consent',
            entityId: existing?.id ?? consent.id,
            details: JSON.stringify({ key: dto.key, version }),
        });
        return this.toConsentResponse(consent);
    }
    async revokeConsent(currentUser, key, version, ipAddress) {
        const where = version
            ? { userId: currentUser.id, key, version }
            : { userId: currentUser.id, key };
        const consents = await this.prisma.consent.findMany({
            where: { ...where, revokedAt: null },
        });
        if (consents.length === 0) {
            throw new BusinessException(ERROR_CODES.CONSENT_ALREADY_REVOKED, 'Keine aktive Einwilligung für diesen Schlüssel', 409);
        }
        const now = new Date();
        const updated = await this.prisma.$transaction(async (tx) => {
            const events = await Promise.all(consents.map(async (consent) => {
                await tx.consentLog.create({
                    data: {
                        userId: currentUser.id,
                        key: consent.key,
                        version: consent.version,
                        action: ConsentAction.revoked,
                        text: consent.text,
                        ipAddress: ipAddress ?? null,
                        source: consent.source ?? 'ui',
                    },
                });
                return tx.consent.update({
                    where: { id: consent.id },
                    data: { revokedAt: now },
                });
            }));
            return events;
        });
        await this.audit.create(currentUser, {
            action: 'CONSENT_REVOKED',
            entity: 'consent',
            entityId: updated[0].id,
            details: JSON.stringify({ key, version: version ?? 'alle' }),
        });
        return this.toConsentResponse(updated[0]);
    }
    async findConsentLog(currentUser) {
        const logs = await this.prisma.consentLog.findMany({
            where: { userId: currentUser.id },
            orderBy: { createdAt: 'desc' },
            take: 200,
        });
        return logs.map((l) => this.toConsentLogResponse(l));
    }
    async findAllLegalBases() {
        const items = await this.prisma.legalBasis.findMany({
            orderBy: { title: 'asc' },
        });
        return items.map((l) => this.toLegalBasisResponse(l));
    }
    async createLegalBasis(dto) {
        const item = await this.prisma.legalBasis.create({
            data: {
                title: dto.title,
                purpose: dto.purpose,
                dataCategories: dto.dataCategories,
                recipients: dto.recipients,
                retentionPeriod: dto.retentionPeriod ?? null,
                legalBasis: dto.legalBasis,
                controller: dto.controller ?? null,
                active: dto.active ?? true,
            },
        });
        return this.toLegalBasisResponse(item);
    }
    async updateLegalBasis(id, dto) {
        await this.loadLegalBasis(id);
        const item = await this.prisma.legalBasis.update({
            where: { id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title } : {}),
                ...(dto.purpose !== undefined ? { purpose: dto.purpose } : {}),
                ...(dto.dataCategories !== undefined
                    ? { dataCategories: dto.dataCategories }
                    : {}),
                ...(dto.recipients !== undefined ? { recipients: dto.recipients } : {}),
                ...(dto.retentionPeriod !== undefined
                    ? { retentionPeriod: dto.retentionPeriod }
                    : {}),
                ...(dto.legalBasis !== undefined ? { legalBasis: dto.legalBasis } : {}),
                ...(dto.controller !== undefined
                    ? { controller: dto.controller }
                    : {}),
                ...(dto.active !== undefined ? { active: dto.active } : {}),
            },
        });
        return this.toLegalBasisResponse(item);
    }
    async removeLegalBasis(id) {
        await this.loadLegalBasis(id);
        await this.prisma.legalBasis.delete({ where: { id } });
    }
    async findAllDpia() {
        const items = await this.prisma.dpiaEntry.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return items.map((d) => this.toDpiaResponse(d));
    }
    async createDpia(currentUser, dto) {
        const item = await this.prisma.dpiaEntry.create({
            data: {
                title: dto.title,
                description: dto.description ?? null,
                riskLevel: dto.riskLevel,
                measures: dto.measures ?? null,
                status: dto.status,
                assessedAt: dto.assessedAt ? new Date(dto.assessedAt) : null,
                assessedBy: dto.assessedAt ? currentUser.id : null,
            },
        });
        return this.toDpiaResponse(item);
    }
    async updateDpia(id, currentUser, dto) {
        await this.loadDpia(id);
        const item = await this.prisma.dpiaEntry.update({
            where: { id },
            data: {
                ...(dto.title !== undefined ? { title: dto.title } : {}),
                ...(dto.description !== undefined
                    ? { description: dto.description }
                    : {}),
                ...(dto.riskLevel !== undefined ? { riskLevel: dto.riskLevel } : {}),
                ...(dto.measures !== undefined ? { measures: dto.measures } : {}),
                ...(dto.status !== undefined ? { status: dto.status } : {}),
                ...(dto.assessedAt !== undefined
                    ? {
                        assessedAt: dto.assessedAt ? new Date(dto.assessedAt) : null,
                        assessedBy: dto.assessedAt ? currentUser.id : null,
                    }
                    : {}),
            },
        });
        return this.toDpiaResponse(item);
    }
    async removeDpia(id) {
        await this.loadDpia(id);
        await this.prisma.dpiaEntry.delete({ where: { id } });
    }
    async collectPersonalData(userId) {
        const [user, einsaetze, berichte, zertifikate, abwesenheiten, noten, checklisten, feedbackGegeben, feedbackErhalten, pruefungen, projekte, konsente,] = await this.prisma.$transaction([
            this.prisma.user.findUnique({
                where: { id: userId },
                include: { roles: true, abteilungen: true },
            }),
            this.prisma.einsatz.findMany({
                where: { azubiId: userId },
                include: { abteilung: true },
            }),
            this.prisma.report.findMany({
                where: { azubiId: userId },
                include: {
                    reportTasks: true,
                    kommentare: true,
                },
            }),
            this.prisma.zertifikat.findMany({ where: { azubiId: userId } }),
            this.prisma.abwesenheit.findMany({ where: { azubiId: userId } }),
            this.prisma.grade.findMany({ where: { azubiId: userId } }),
            this.prisma.checklist.findMany({
                where: { azubiId: userId },
                include: { items: true },
            }),
            this.prisma.feedback.findMany({ where: { vonUserId: userId } }),
            this.prisma.feedback.findMany({ where: { anUserId: userId } }),
            this.prisma.pruefung.findMany({
                where: { azubiId: userId },
                include: { meilensteine: true },
            }),
            this.prisma.projekt.findMany({ where: { azubiId: userId } }),
            this.prisma.consent.findMany({ where: { userId } }),
        ]);
        return {
            exportedAt: new Date().toISOString(),
            user: user
                ? {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isActive: user.isActive,
                }
                : {},
            profile: user
                ? {
                    roles: user.roles.map((r) => r.role),
                    abteilungen: user.abteilungen.map((a) => a.id),
                    azubiId: user.azubiId,
                }
                : {},
            einsaetze: einsaetze.map((e) => ({
                id: e.id,
                abteilung: e.abteilung?.name,
                von: e.von,
                bis: e.bis,
                skillLevel: e.skillLevel,
            })),
            berichte: berichte.map((r) => ({
                id: r.id,
                titel: r.titel,
                typ: r.typ,
                kalenderwoche: r.kalenderwoche,
                jahr: r.jahr,
                status: r.status,
                inhalt: r.inhaltMarkdown,
                tasks: r.reportTasks.map((rt) => rt.taskId),
                kommentare: r.kommentare,
            })),
            zertifikate,
            abwesenheiten,
            noten,
            checklisten,
            feedbackGegeben,
            feedbackErhalten,
            pruefungen,
            projekte,
            konsente,
        };
    }
    async scopeWhere(currentUser) {
        if (currentUser.roles.includes(Role.azubi)) {
            return { userId: currentUser.id };
        }
        const visible = await this.scope.getVisibleAzubiIds(currentUser);
        if (visible === 'ALL') {
            return {};
        }
        return { userId: { in: [...visible] } };
    }
    async assertCanRead(userId, currentUser) {
        if (userId === currentUser.id) {
            return;
        }
        if (currentUser.roles.includes(Role.ausbilder) ||
            currentUser.roles.includes(Role.hr) ||
            currentUser.roles.includes(Role.admin)) {
            await this.scope.assertCanAccessAzubi(currentUser, userId);
            return;
        }
        throw new ForbiddenException({
            errorCode: ERROR_CODES.ACCESS_DENIED,
            message: 'Kein Zugriff auf diese Anfrage',
        });
    }
    assertProcessor(user, action) {
        const allowed = user.roles.some((r) => r === Role.ausbilder || r === Role.hr || r === Role.admin);
        if (!allowed) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: `Keine Berechtigung: ${action}`,
            });
        }
    }
    async loadRequest(id) {
        const request = await this.prisma.datenschutzRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.DATA_REQUEST_NOT_FOUND,
                message: `Datenschutzanfrage ${id} nicht gefunden`,
            });
        }
        return request;
    }
    async loadLegalBasis(id) {
        const item = await this.prisma.legalBasis.findUnique({ where: { id } });
        if (!item) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.LEGAL_BASIS_NOT_FOUND,
                message: `Verarbeitung ${id} nicht gefunden`,
            });
        }
        return item;
    }
    async loadDpia(id) {
        const item = await this.prisma.dpiaEntry.findUnique({ where: { id } });
        if (!item) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.DPIA_ENTRY_NOT_FOUND,
                message: `DPIA-Eintrag ${id} nicht gefunden`,
            });
        }
        return item;
    }
    toRequestResponse(r) {
        return {
            id: r.id,
            userId: r.userId,
            typ: r.typ,
            status: r.status,
            details: r.details,
            requestedAt: r.requestedAt,
            dueDate: r.dueDate,
            completedAt: r.completedAt,
            result: r.result,
            processedBy: r.processedBy,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
        };
    }
    toConsentResponse(consent) {
        return {
            id: consent.id,
            userId: consent.userId,
            key: consent.key,
            version: consent.version,
            text: consent.text,
            grantedAt: consent.grantedAt,
            revokedAt: consent.revokedAt,
            ipAddress: consent.ipAddress,
            source: consent.source,
            active: consent.revokedAt === null,
        };
    }
    toConsentLogResponse(log) {
        return {
            id: log.id,
            userId: log.userId,
            key: log.key,
            version: log.version,
            action: log.action,
            text: log.text,
            ipAddress: log.ipAddress,
            source: log.source,
            createdAt: log.createdAt,
        };
    }
    toLegalBasisResponse(item) {
        return {
            id: item.id,
            title: item.title,
            purpose: item.purpose,
            dataCategories: item.dataCategories,
            recipients: item.recipients,
            retentionPeriod: item.retentionPeriod,
            legalBasis: item.legalBasis,
            controller: item.controller,
            active: item.active,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
    toDpiaResponse(item) {
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            riskLevel: item.riskLevel,
            measures: item.measures,
            status: item.status,
            assessedAt: item.assessedAt,
            assessedBy: item.assessedBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
};
DatenschutzService = DatenschutzService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService,
        AuditService])
], DatenschutzService);
export { DatenschutzService };
//# sourceMappingURL=data-privacy.service.js.map