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
import { NotificationCategory, ReportStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { buildSimplePdf } from '../../common/utils/pdf.js';
import { withPagination } from '../../common/dto/pagination-query.dto.js';
let BerichteService = class BerichteService {
    prisma;
    scope;
    notifications;
    audit;
    constructor(prisma, scope, notifications, audit) {
        this.prisma = prisma;
        this.scope = scope;
        this.notifications = notifications;
        this.audit = audit;
    }
    async create(currentUser, dto) {
        if (!currentUser.roles.includes(Role.azubi) || !currentUser.azubiId) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Azubis dürfen Berichte erstellen',
            });
        }
        const datumVon = new Date(dto.datumVon);
        const datumBis = new Date(dto.datumBis);
        if (datumVon >= datumBis) {
            throw new BusinessException(ERROR_CODES.VALIDATION_FAILED, 'datumVon muss vor datumBis liegen', 400);
        }
        await this.assertTasksReleased(dto.taskIds ?? []);
        const report = await this.prisma.report.create({
            data: {
                azubiId: currentUser.azubiId,
                titel: dto.titel,
                typ: dto.typ,
                kalenderwoche: dto.kalenderwoche,
                jahr: dto.jahr,
                datumVon: new Date(dto.datumVon),
                datumBis: new Date(dto.datumBis),
                inhaltMarkdown: dto.inhaltMarkdown,
                status: ReportStatus.entwurf,
                reportTasks: {
                    create: (dto.taskIds ?? []).map((taskId) => ({ taskId })),
                },
            },
            include: { reportTasks: true },
        });
        await this.audit.create(currentUser, {
            action: 'REPORT_CREATED',
            entity: 'report',
            entityId: report.id,
        });
        return this.toResponse(report);
    }
    async findAll(currentUser, query, filter) {
        const visible = await this.scope.getVisibleAzubiIds(currentUser);
        const where = {};
        if (visible !== 'ALL') {
            where.azubiId = { in: [...visible] };
        }
        if (filter.azubiId) {
            await this.scope.assertCanAccessAzubi(currentUser, filter.azubiId);
            where.azubiId = filter.azubiId;
        }
        if (filter.status) {
            where.status = filter.status;
        }
        if (filter.jahr) {
            where.jahr = filter.jahr;
        }
        if (filter.typ) {
            where.typ = filter.typ;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.report.findMany({
                where,
                include: { reportTasks: true },
                orderBy: [{ jahr: 'desc' }, { kalenderwoche: 'desc' }],
                skip: (query.page - 1) * query.limit,
                take: query.limit,
            }),
            this.prisma.report.count({ where }),
        ]);
        return withPagination(items.map((r) => this.toResponse(r)), query.page, query.limit, total);
    }
    async findOne(id, currentUser) {
        await this.scope.assertCanAccessBericht(currentUser, id);
        const report = await this.load(id);
        return this.toResponse(report);
    }
    async update(id, currentUser, dto) {
        await this.loadOwned(currentUser, id, ReportStatus.entwurf);
        await this.assertTasksReleased(dto.taskIds ?? []);
        if (dto.datumVon !== undefined && dto.datumBis !== undefined) {
            const datumVon = new Date(dto.datumVon);
            const datumBis = new Date(dto.datumBis);
            if (datumVon >= datumBis) {
                throw new BusinessException(ERROR_CODES.VALIDATION_FAILED, 'datumVon muss vor datumBis liegen', 400);
            }
        }
        const updated = await this.prisma.report.update({
            where: { id },
            data: {
                ...(dto.titel !== undefined ? { titel: dto.titel } : {}),
                ...(dto.typ !== undefined ? { typ: dto.typ } : {}),
                ...(dto.kalenderwoche !== undefined
                    ? { kalenderwoche: dto.kalenderwoche }
                    : {}),
                ...(dto.jahr !== undefined ? { jahr: dto.jahr } : {}),
                ...(dto.datumVon !== undefined
                    ? { datumVon: new Date(dto.datumVon) }
                    : {}),
                ...(dto.datumBis !== undefined
                    ? { datumBis: new Date(dto.datumBis) }
                    : {}),
                ...(dto.inhaltMarkdown !== undefined
                    ? { inhaltMarkdown: dto.inhaltMarkdown }
                    : {}),
                ...(dto.taskIds !== undefined
                    ? {
                        reportTasks: {
                            deleteMany: {},
                            create: dto.taskIds.map((taskId) => ({ taskId })),
                        },
                    }
                    : {}),
            },
            include: { reportTasks: true },
        });
        await this.audit.create(currentUser, {
            action: 'REPORT_UPDATED',
            entity: 'report',
            entityId: id,
        });
        return this.toResponse(updated);
    }
    async remove(id, currentUser) {
        await this.loadOwned(currentUser, id, ReportStatus.entwurf);
        await this.prisma.report.delete({ where: { id } });
        await this.audit.create(currentUser, {
            action: 'REPORT_DELETED',
            entity: 'report',
            entityId: id,
        });
    }
    async submit(id, currentUser) {
        const report = await this.loadOwned(currentUser, id, ReportStatus.entwurf);
        const updated = await this.prisma.report.update({
            where: { id: report.id },
            data: { status: ReportStatus.eingereicht },
            include: { reportTasks: true },
        });
        await this.notifyReviewers(report.titel, report.kalenderwoche, report.jahr, id);
        const cnt = await this.prisma.reportVersion.count({
            where: { reportId: report.id },
        });
        await this.prisma.reportVersion.create({
            data: {
                reportId: report.id,
                version: cnt + 1,
                inhaltMarkdown: report.inhaltMarkdown,
                erstelltVon: currentUser.id,
            },
        });
        await this.audit.create(currentUser, {
            action: 'REPORT_SUBMITTED',
            entity: 'report',
            entityId: id,
        });
        return this.toResponse(updated);
    }
    async addAttachment(id, user, dto) {
        await this.scope.assertCanAccessBericht(user, id);
        await this.prisma.reportAttachment.create({
            data: {
                reportId: id,
                typ: dto.typ,
                dateiUrl: dto.dateiUrl,
                kommentar: dto.kommentar,
                erstelltVon: user.id,
            },
        });
    }
    async getAttachments(id, user) {
        await this.scope.assertCanAccessBericht(user, id);
        return this.prisma.reportAttachment.findMany({
            where: { reportId: id },
        });
    }
    async addTimeEntry(id, user, dto) {
        await this.scope.assertCanAccessBericht(user, id);
        await this.prisma.reportTimeEntry.create({
            data: {
                reportId: id,
                taskId: dto.taskId,
                stunden: dto.stunden,
                kommentar: dto.kommentar,
            },
        });
    }
    async getTimeEntries(id, user) {
        await this.scope.assertCanAccessBericht(user, id);
        return this.prisma.reportTimeEntry.findMany({
            where: { reportId: id },
        });
    }
    async getVersions(id, user) {
        await this.scope.assertCanAccessBericht(user, id);
        return this.prisma.reportVersion.findMany({
            where: { reportId: id },
            orderBy: { version: 'asc' },
        });
    }
    async getDiff(id, user, v1, v2) {
        await this.scope.assertCanAccessBericht(user, id);
        const [a, b] = await Promise.all([
            this.prisma.reportVersion.findFirst({
                where: { reportId: id, version: v1 },
            }),
            this.prisma.reportVersion.findFirst({
                where: { reportId: id, version: v2 },
            }),
        ]);
        return { v1: a?.inhaltMarkdown ?? '', v2: b?.inhaltMarkdown ?? '' };
    }
    async review(id, currentUser, dto) {
        if (!currentUser.roles.includes(Role.ausbildungsbeauftragter)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbildungsbeauftragte dürfen vorprüfen',
            });
        }
        await this.scope.assertCanAccessBericht(currentUser, id);
        const report = await this.load(id);
        if (report.status !== ReportStatus.eingereicht) {
            throw new BusinessException(ERROR_CODES.REPORT_NOT_IN_REVIEW, 'Bericht ist nicht zur Prüfung eingereicht', 409);
        }
        const nextStatus = dto.entscheidung === 'freigeben'
            ? ReportStatus.in_pruefung
            : ReportStatus.entwurf;
        await this.addCommentInternal(id, currentUser, dto.kommentar, 'pruefung');
        const updated = await this.prisma.report.update({
            where: { id },
            data: { status: nextStatus },
            include: { reportTasks: true },
        });
        await this.notifications.create({
            userId: updated.azubiId,
            category: NotificationCategory.review,
            title: nextStatus === ReportStatus.in_pruefung
                ? 'Bericht in Prüfung'
                : 'Bericht zur Überarbeitung zurückgegeben',
            message: nextStatus === ReportStatus.in_pruefung
                ? `Ihr Bericht „${updated.titel}“ (KW ${updated.kalenderwoche}/${updated.jahr}) wurde geprüft und geht in die abschließende Prüfung.`
                : `Ihr Bericht „${updated.titel}“ (KW ${updated.kalenderwoche}/${updated.jahr}) wurde zur Überarbeitung zurückgegeben.`,
            referenceType: 'report',
            referenceId: id,
        });
        return this.toResponse(updated);
    }
    async visieren(id, currentUser) {
        if (!currentUser.roles.includes(Role.ausbilder)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder dürfen final visieren',
            });
        }
        await this.scope.assertCanAccessBericht(currentUser, id);
        const report = await this.load(id);
        if (report.status !== ReportStatus.in_pruefung) {
            throw new BusinessException(ERROR_CODES.REPORT_NOT_IN_REVIEW, 'Bericht muss sich in Prüfung befinden', 409);
        }
        const updated = await this.prisma.report.update({
            where: { id },
            data: {
                status: ReportStatus.visiert,
                signiertVon: currentUser.id,
                signiertAm: new Date(),
            },
            include: { reportTasks: true },
        });
        await this.notifications.create({
            userId: updated.azubiId,
            category: NotificationCategory.review,
            title: 'Bericht visiert',
            message: `Ihr Bericht „${updated.titel}“ (KW ${updated.kalenderwoche}/${updated.jahr}) wurde final visiert.`,
            referenceType: 'report',
            referenceId: id,
        });
        await this.audit.create(currentUser, {
            action: 'REPORT_VISIERT',
            entity: 'report',
            entityId: id,
        });
        return this.toResponse(updated);
    }
    async archivieren(id, currentUser) {
        if (!currentUser.roles.includes(Role.ausbilder)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder dürfen archivieren',
            });
        }
        await this.scope.assertCanAccessBericht(currentUser, id);
        const report = await this.load(id);
        if (report.status !== ReportStatus.visiert) {
            throw new BusinessException(ERROR_CODES.REPORT_ALREADY_ARCHIVED, 'Nur visierte Berichte können archiviert werden', 409);
        }
        const updated = await this.prisma.report.update({
            where: { id },
            data: { status: ReportStatus.archiviert, archiviertAm: new Date() },
            include: { reportTasks: true },
        });
        await this.audit.create(currentUser, {
            action: 'REPORT_ARCHIVIERT',
            entity: 'report',
            entityId: id,
        });
        return this.toResponse(updated);
    }
    async cancel(id, currentUser) {
        const report = await this.loadOwned(currentUser, id, ReportStatus.eingereicht);
        const updated = await this.prisma.report.update({
            where: { id: report.id },
            data: { status: ReportStatus.entwurf },
            include: { reportTasks: true },
        });
        const reviewers = await this.prisma.user.findMany({
            where: {
                roles: {
                    some: { role: { in: [Role.ausbilder, Role.ausbildungsbeauftragter] } },
                },
            },
            select: { id: true },
        });
        for (const reviewer of reviewers) {
            await this.notifications.create({
                userId: reviewer.id,
                category: NotificationCategory.review,
                title: 'Bericht-Einreichung zurückgezogen',
                message: `Der Bericht „${report.titel}" (KW ${report.kalenderwoche}/${report.jahr}) wurde vom Azubi zurückgezogen.`,
                referenceType: 'report',
                referenceId: id,
            });
        }
        await this.audit.create(currentUser, {
            action: 'REPORT_CANCELLED',
            entity: 'report',
            entityId: id,
        });
        return this.toResponse(updated);
    }
    async addComment(id, currentUser, dto) {
        const allowed = currentUser.roles.includes(Role.ausbildungsbeauftragter) ||
            currentUser.roles.includes(Role.ausbilder);
        if (!allowed) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Keine Berechtigung für Kommentare',
            });
        }
        await this.scope.assertCanAccessBericht(currentUser, id);
        await this.addCommentInternal(id, currentUser, dto.text, dto.art ?? 'bemerkung');
    }
    async getComments(id, currentUser) {
        await this.scope.assertCanAccessBericht(currentUser, id);
        return this.prisma.reportComment.findMany({
            where: { reportId: id },
            orderBy: { createdAt: 'asc' },
        });
    }
    async exportPdf(id, currentUser) {
        await this.scope.assertCanAccessBericht(currentUser, id);
        const report = await this.load(id);
        const azubi = await this.prisma.user.findUnique({
            where: { id: report.azubiId },
            select: { firstName: true, lastName: true },
        });
        const lines = [
            `Auszubildende(r): ${azubi?.firstName ?? ''} ${azubi?.lastName ?? ''}`,
            `Kalenderwoche: ${report.kalenderwoche} / Jahr: ${report.jahr}`,
            `Typ: ${report.typ}   Status: ${report.status}`,
            `Zeitraum: ${report.datumVon.toISOString().slice(0, 10)} bis ${report.datumBis.toISOString().slice(0, 10)}`,
            '',
            report.inhaltMarkdown.replace(/[#*_`>-]/g, '').slice(0, 8000),
        ];
        return buildSimplePdf(`Berichtsheft - ${report.titel}`, lines);
    }
    async loadOwned(currentUser, id, expectedStatus) {
        if (!currentUser.roles.includes(Role.azubi) ||
            !currentUser.azubiId) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur der erstellende Azubi darf diesen Bericht bearbeiten',
            });
        }
        const report = await this.load(id);
        if (report.azubiId !== currentUser.azubiId) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Kein Zugriff auf diesen Bericht',
            });
        }
        if (report.status !== expectedStatus) {
            throw new BusinessException(ERROR_CODES.REPORT_NOT_EDITABLE, `Bericht ist nicht im Status ${expectedStatus}`, 409);
        }
        return report;
    }
    async load(id) {
        const report = await this.prisma.report.findUnique({
            where: { id },
            include: { reportTasks: true },
        });
        if (!report) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.REPORT_NOT_FOUND,
                message: `Bericht ${id} nicht gefunden`,
            });
        }
        return report;
    }
    async notifyReviewers(titel, kalenderwoche, jahr, reportId) {
        const reviewers = await this.prisma.user.findMany({
            where: {
                roles: {
                    some: { role: { in: [Role.ausbilder, Role.ausbildungsbeauftragter] } },
                },
            },
            select: { id: true },
        });
        for (const reviewer of reviewers) {
            await this.notifications.create({
                userId: reviewer.id,
                category: NotificationCategory.review,
                title: 'Bericht wartet auf Prüfung',
                message: `Der Bericht „${titel}“ (KW ${kalenderwoche}/${jahr}) wurde eingereicht und wartet auf Prüfung.`,
                referenceType: 'report',
                referenceId: reportId,
            });
        }
    }
    async assertTasksReleased(taskIds) {
        if (taskIds.length === 0) {
            return;
        }
        const released = await this.prisma.task.count({
            where: { id: { in: taskIds }, freigegeben: true },
        });
        if (released !== taskIds.length) {
            throw new BusinessException(ERROR_CODES.TASK_NOT_FOUND, 'Ein oder mehrere Tasks sind nicht freigegeben', 409);
        }
    }
    async addCommentInternal(reportId, currentUser, text, art) {
        if (!text) {
            return;
        }
        await this.prisma.reportComment.create({
            data: { reportId, authorId: currentUser.id, text, art },
        });
    }
    async getReviewQueue(currentUser, query, filter) {
        const visible = await this.scope.getVisibleAzubiIds(currentUser);
        const where = {
            status: ReportStatus.eingereicht,
        };
        if (visible !== 'ALL') {
            where.azubiId = { in: [...visible] };
        }
        if (filter.azubiId) {
            await this.scope.assertCanAccessAzubi(currentUser, filter.azubiId);
            where.azubiId = filter.azubiId;
        }
        if (filter.jahr) {
            where.jahr = filter.jahr;
        }
        if (filter.kalenderwoche) {
            where.kalenderwoche = filter.kalenderwoche;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.report.findMany({
                where,
                include: {
                    reportTasks: true,
                    azubi: {
                        select: { firstName: true, lastName: true },
                    },
                },
                orderBy: [{ jahr: 'asc' }, { kalenderwoche: 'asc' }],
                skip: (query.page - 1) * query.limit,
                take: query.limit,
            }),
            this.prisma.report.count({ where }),
        ]);
        const mapped = items.map((r) => ({
            ...this.toResponse(r),
            azubiName: `${r.azubi.firstName} ${r.azubi.lastName}`,
        }));
        return withPagination(mapped, query.page, query.limit, total);
    }
    async batchReview(currentUser, dto) {
        if (dto.reportIds.length > 100) {
            throw new BusinessException(ERROR_CODES.VALIDATION_FAILED, 'Maximal 100 Berichte pro Batch', 400);
        }
        const results = [];
        for (const reportId of dto.reportIds) {
            try {
                await this.review(reportId, currentUser, {
                    entscheidung: dto.entscheidung,
                    kommentar: dto.kommentar,
                });
                results.push({ reportId, success: true });
            }
            catch (error) {
                results.push({
                    reportId,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unbekannter Fehler',
                });
            }
        }
        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.filter((r) => !r.success).length;
        return {
            total: dto.reportIds.length,
            successCount,
            errorCount,
            results,
        };
    }
    async exportReviewCsv(currentUser) {
        const visible = await this.scope.getVisibleAzubiIds(currentUser);
        const where = {};
        if (visible !== 'ALL') {
            where.azubiId = { in: [...visible] };
        }
        const reports = await this.prisma.report.findMany({
            where,
            include: {
                azubi: { select: { firstName: true, lastName: true } },
                kommentare: { select: { text: true, art: true, createdAt: true } },
            },
            orderBy: [{ jahr: 'desc' }, { kalenderwoche: 'desc' }],
        });
        const header = 'azubiName,kalenderwoche,jahr,typ,status,datumVon,datumBis,kommentare,createdAt';
        const rows = reports.map((r) => {
            const name = `"${r.azubi.firstName} ${r.azubi.lastName}"`;
            const kommentare = r.kommentare.map((k) => k.text).join(' | ').replace(/"/g, '""');
            return [
                name,
                r.kalenderwoche,
                r.jahr,
                r.typ,
                r.status,
                r.datumVon.toISOString().slice(0, 10),
                r.datumBis.toISOString().slice(0, 10),
                `"${kommentare}"`,
                r.createdAt.toISOString(),
            ].join(',');
        });
        return [header, ...rows].join('\n');
    }
    toResponse(report) {
        return {
            id: report.id,
            azubiId: report.azubiId,
            titel: report.titel,
            typ: report.typ,
            kalenderwoche: report.kalenderwoche,
            jahr: report.jahr,
            datumVon: report.datumVon,
            datumBis: report.datumBis,
            inhaltMarkdown: report.inhaltMarkdown,
            status: report.status,
            signiertVon: report.signiertVon,
            signiertAm: report.signiertAm,
            archiviertAm: report.archiviertAm,
            taskIds: report.reportTasks.map((rt) => rt.taskId),
            createdAt: report.createdAt,
        };
    }
};
BerichteService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService,
        NotificationsService,
        AuditService])
], BerichteService);
export { BerichteService };
//# sourceMappingURL=reports.service.js.map