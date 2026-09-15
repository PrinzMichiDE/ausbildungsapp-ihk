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
let NotenService = class NotenService {
    prisma;
    scope;
    constructor(prisma, scope) {
        this.prisma = prisma;
        this.scope = scope;
    }
    async getVersions(id, currentUser) {
        await this.scope.assertCanAccessAzubi(currentUser, id);
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        const versions = await this.prisma.gradeVersion.findMany({
            where: { gradeId: id },
            orderBy: { version: 'asc' },
        });
        return versions.map((v) => this.toVersionResponse(v));
    }
    async getDiff(id, currentUser, v1, v2) {
        await this.scope.assertCanAccessAzubi(currentUser, id);
        const [a, b] = await Promise.all([
            this.prisma.gradeVersion.findFirst({ where: { gradeId: id, version: v1 } }),
            this.prisma.gradeVersion.findFirst({ where: { gradeId: id, version: v2 } }),
        ]);
        return { v1: a?.bemerkungen ?? '', v2: b?.bemerkungen ?? '' };
    }
    async getGPA(azubiId, currentUser) {
        await this.scope.assertCanAccessAzubi(currentUser, azubiId);
        const grades = await this.prisma.grade.findMany({
            where: { azubiId, status: { in: ['bestaetigt', 'visiert', 'archiviert'] } },
        });
        if (grades.length === 0)
            return { gesamt: 0, erstesHalbjahr: null, zweitesHalbjahr: null, anzahlNoten: 0 };
        const gewichteteSumme = grades.reduce((s, g) => s + (g.note * (g.gewichtung ?? 1.0)), 0);
        const gesamtGewichtung = grades.reduce((s, g) => s + (g.gewichtung ?? 1.0), 0);
        const gesamt = gesamtGewichtung > 0 ? Math.round((gewichteteSumme / gesamtGewichtung) * 100) / 100 : 0;
        const erstes = grades.filter((g) => g.halbjahr === 'erstes');
        const zweites = grades.filter((g) => g.halbjahr === 'zweites');
        const erstesGPA = erstes.length > 0 ? Math.round((erstes.reduce((s, g) => s + g.note * (g.gewichtung ?? 1.0), 0) / erstes.reduce((s, g) => s + (g.gewichtung ?? 1.0), 0)) * 100) / 100 : null;
        const zweitesGPA = zweites.length > 0 ? Math.round((zweites.reduce((s, g) => s + g.note * (g.gewichtung ?? 1.0), 0) / zweites.reduce((s, g) => s + (g.gewichtung ?? 1.0), 0)) * 100) / 100 : null;
        return { gesamt, erstesHalbjahr: erstesGPA, zweitesHalbjahr: zweitesGPA, anzahlNoten: grades.length };
    }
    async getDashboard(currentUser, filter) {
        const where = await this.scopeWhere(currentUser);
        if (filter?.fach)
            where.fach = filter.fach;
        if (filter?.halbjahr)
            where.halbjahr = filter.halbjahr;
        if (filter?.zeitraum)
            where.zeitraum = filter.zeitraum;
        const [noten, anzahlProStatus] = await this.prisma.$transaction([
            this.prisma.grade.findMany({ where, orderBy: { zeitraum: 'desc' } }),
            this.prisma.grade.groupBy({ by: ['status'], where, _count: { _all: true } }),
        ]);
        const statusMap = {};
        for (const g of anzahlProStatus)
            statusMap[g.status] = (g._count?._all ?? 0);
        const fachMap = {};
        for (const g of noten) {
            if (!fachMap[g.fach])
                fachMap[g.fach] = [];
            fachMap[g.fach].push(g.note);
        }
        const fachDurchschnitte = {};
        for (const [fach, n] of Object.entries(fachMap))
            fachDurchschnitte[fach] = Math.round((n.reduce((a, b) => a + b, 0) / n.length) * 100) / 100;
        return { zusammenfassung: { insgesamt: noten.length, nachStatus: statusMap, nachFach: fachDurchschnitte }, noten };
    }
    async getWarnliste(currentUser) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR' });
        }
        const where = (await this.scopeWhere(currentUser));
        const grades = await this.prisma.grade.findMany({ where: { ...where, note: { gte: 3 } }, orderBy: { note: 'desc' } });
        return {
            kritisch: grades.filter((g) => g.note >= 5).map((g) => ({ ...g, warnstufe: 'kritisch' })),
            warnung: grades.filter((g) => g.note >= 4 && g.note < 5).map((g) => ({ ...g, warnstufe: 'warnung' })),
            gut: grades.filter((g) => g.note >= 3 && g.note < 4).map((g) => ({ ...g, warnstufe: 'gut' })),
            gesamt: grades.length,
        };
    }
    async create(currentUser, dto) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR dürfen Noten erfassen',
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
        const grade = await this.prisma.grade.create({
            data: {
                azubiId,
                fach: dto.fach,
                note: dto.note,
                zeitraum: dto.zeitraum,
                halbjahr: dto.halbjahr ?? null,
                datum: dto.datum ?? null,
                pruefungsart: dto.pruefungsart ?? null,
                gewichtung: dto.gewichtung ?? 1.0,
                gewichtungsKategorie: dto.gewichtungsKategorie ?? null,
                typ: dto.typ ?? 'note',
                beschreibung: dto.beschreibung ?? null,
                bemerkungen: dto.bemerkungen ?? null,
                prueferId: dto.prueferId ?? null,
                pruefungsdatum: dto.pruefungsdatum ?? null,
                wiederholung: dto.wiederholung ?? false,
                maßnahme: dto.maßnahme ?? null,
                zeugnisUrl: dto.zeugnisUrl ?? null,
                quellenUrl: dto.quellenUrl ?? null,
                kursId: dto.kursId ?? null,
            },
        });
        return this.toResponse(grade);
    }
    async findAll(currentUser) {
        const where = await this.scopeWhere(currentUser);
        const items = await this.prisma.grade.findMany({
            where,
            orderBy: { zeitraum: 'desc' },
        });
        return items.map((g) => this.toResponse(g));
    }
    async findOne(id, currentUser) {
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        await this.scope.assertCanAccessAzubi(currentUser, grade.azubiId);
        return this.toResponse(grade);
    }
    async remove(id, currentUser) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR dürfen Noten löschen',
            });
        }
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        await this.prisma.grade.delete({ where: { id } });
    }
    async confirm(id, currentUser) {
        if (!currentUser.roles.includes(Role.ausbilder)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder dürfen Noten bestätigen',
            });
        }
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        if (grade.status !== 'entwurf') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Entwürfe können bestätigt werden',
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: { status: 'bestaetigt' },
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
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        if (grade.status !== 'bestaetigt') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur bestätigte Noten können visiert werden',
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: { status: 'visiert' },
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
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        if (grade.status !== 'visiert') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur visierte Noten können archiviert werden',
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: { status: 'archiviert' },
        });
        return this.toResponse(updated);
    }
    async bewerten(id, currentUser, dto) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR dürfen bewerten',
            });
        }
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: {
                bewertung: dto.bewertung,
                bewertetVon: currentUser.id,
                bewertetAm: new Date(),
                pruefungsdatum: dto.pruefungsdatum ?? null,
            },
        });
        return this.toResponse(updated);
    }
    async zeugnisUpload(id, currentUser, dto) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR dürfen Zeugnisse hochladen',
            });
        }
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        if (grade.status === 'archiviert') {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Archivierte Noten können nicht mehr geändert werden',
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: { zeugnisUrl: dto.zeugnisUrl },
        });
        return this.toResponse(updated);
    }
    async wiederholung(id, currentUser, dto) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR dürfen Wiederholungen dokumentieren',
            });
        }
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: {
                wiederholung: true,
                maßnahme: dto.maßnahme ?? null,
            },
        });
        return this.toResponse(updated);
    }
    async addMaßnahme(id, currentUser, dto) {
        if (!this.canManage(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/HR dürfen Fördermaßnahmen dokumentieren',
            });
        }
        const grade = await this.prisma.grade.findUnique({ where: { id } });
        if (!grade) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.GRADE_NOT_FOUND,
                message: `Note ${id} nicht gefunden`,
            });
        }
        const updated = await this.prisma.grade.update({
            where: { id },
            data: { maßnahme: dto.maßnahme },
        });
        return this.toResponse(updated);
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
    toResponse(g) {
        return {
            id: g.id,
            azubiId: g.azubiId,
            fach: g.fach,
            note: g.note,
            zeitraum: g.zeitraum,
            halbjahr: g.halbjahr,
            datum: g.datum,
            pruefungsart: g.pruefungsart,
            gewichtung: g.gewichtung ?? 1.0,
            gewichtungsKategorie: g.gewichtungsKategorie,
            typ: g.typ,
            status: g.status,
            beschreibung: g.beschreibung,
            bemerkungen: g.bemerkungen,
            prueferId: g.prueferId,
            pruefungsdatum: g.pruefungsdatum,
            wiederholung: g.wiederholung,
            maßnahme: g.maßnahme,
            zeugnisUrl: g.zeugnisUrl,
            quellenUrl: g.quellenUrl,
            kursId: g.kursId,
            bewertetVon: g.bewertetVon,
            bewertetAm: g.bewertetAm,
            bewertung: g.bewertung ?? null,
            createdAt: g.createdAt,
            updatedAt: g.updatedAt,
        };
    }
    toVersionResponse(v) {
        return {
            id: v.id,
            gradeId: v.gradeId,
            version: v.version,
            fach: v.fach,
            note: v.note,
            status: v.status,
            zeitraum: v.zeitraum,
            halbjahr: v.halbjahr,
            datum: v.datum,
            pruefungsart: v.pruefungsart,
            gewichtung: v.gewichtung ?? 1.0,
            gewichtungsKategorie: v.gewichtungsKategorie,
            typ: v.typ,
            bemerkungen: v.bemerkungen,
            prueferId: v.prueferId,
            pruefungsdatum: v.pruefungsdatum,
            wiederholung: v.wiederholung,
            maßnahme: v.maßnahme,
            zeugnisUrl: v.zeugnisUrl,
            bewertetVon: v.bewertetVon,
            bewertetAm: v.bewertetAm,
            erstelltVon: v.erstelltVon,
            createdAt: v.createdAt,
        };
    }
};
NotenService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AccessScopeService])
], NotenService);
export { NotenService };
//# sourceMappingURL=grades.service.js.map