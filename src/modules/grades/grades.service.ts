import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { AuditService } from '../../modules/audit/audit.service.js';
import { NotificationsService } from '../../modules/notifications/notifications.service.js';
import { buildSimplePdf } from '../../common/utils/pdf.js';
import { NotificationCategory } from '@prisma/client';
import { CreateGradeDto, GradeResponseDto, GradeVersionResponseDto } from './dto/grade.dto.js';

@Injectable()
export class NotenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(currentUser: CurrentUser, dto: CreateGradeDto): Promise<GradeResponseDto> {
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR dürfen Noten erfassen' });
    }
    const azubiId = dto.azubiId ?? currentUser.azubiId;
    if (!azubiId) throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'azubiId ist erforderlich' });
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);
    const grade = await this.prisma.grade.create({
      data: {
        azubiId, fach: dto.fach, note: dto.note, zeitraum: dto.zeitraum,
        halbjahr: dto.halbjahr ?? null, datum: dto.datum ?? null,
        pruefungsart: dto.pruefungsart ?? null, gewichtung: dto.gewichtung ?? 1.0,
        gewichtungsKategorie: dto.gewichtungsKategorie ?? null, typ: dto.typ ?? 'note',
        beschreibung: dto.beschreibung ?? null, bemerkungen: dto.bemerkungen ?? null,
        prueferId: dto.prueferId ?? null, pruefungsdatum: dto.pruefungsdatum ?? null,
        wiederholung: dto.wiederholung ?? false, maßnahme: dto.maßnahme ?? null,
        zeugnisUrl: dto.zeugnisUrl ?? null, quellenUrl: dto.quellenUrl ?? null,
        kursId: dto.kursId ?? null,
      },
    });
    await this.audit.create(currentUser, { action: 'grade.create', entity: 'Grade', entityId: grade.id, details: JSON.stringify({ fach: grade.fach, note: grade.note }) });
    return this.toResponse(grade);
  }

  async findAll(currentUser: CurrentUser): Promise<GradeResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.grade.findMany({ where, orderBy: { zeitraum: 'desc' } });
    return items.map((g) => this.toResponse(g));
  }

  async findOne(id: string, currentUser: CurrentUser): Promise<GradeResponseDto> {
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    await this.scope.assertCanAccessAzubi(currentUser, grade.azubiId);
    return this.toResponse(grade);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    if (!this.canManage(currentUser)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR dürfen Noten löschen' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    if (grade.status === 'archiviert') throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Archivierte Noten können nicht gelöscht werden' });
    await this.prisma.grade.delete({ where: { id } });
    await this.audit.create(currentUser, { action: 'grade.delete', entity: 'Grade', entityId: id, details: JSON.stringify({ fach: grade.fach }) });
  }

  async getWarnliste(currentUser: CurrentUser) {
    if (!this.canManage(currentUser)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR' });
    const where = await this.scopeWhere(currentUser);
    const grades = await this.prisma.grade.findMany({ where: { ...where, note: { gte: 3 } }, orderBy: { note: 'desc' } });
    return {
      kritisch: grades.filter((g) => g.note >= 5).map((g) => ({ ...g, warnstufe: 'kritisch' })),
      warnung: grades.filter((g) => g.note >= 4 && g.note < 5).map((g) => ({ ...g, warnstufe: 'warnung' })),
      gut: grades.filter((g) => g.note >= 3 && g.note < 4).map((g) => ({ ...g, warnstufe: 'gut' })),
      gesamt: grades.length,
    };
  }

  async confirm(id: string, currentUser: CurrentUser): Promise<GradeResponseDto> {
    if (!currentUser.roles.includes(Role.ausbilder)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder dürfen Noten bestätigen' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    if (grade.status !== 'entwurf') throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Entwürfe können bestätigt werden' });
    const updated = await this.prisma.grade.update({ where: { id }, data: { status: 'bestaetigt' } });
    await this.createVersion(updated);
    await this.audit.create(currentUser, { action: 'grade.status_change', entity: 'Grade', entityId: id, details: JSON.stringify({ from: 'entwurf', to: 'bestaetigt' }) });
    await this.notifications.create({
      userId: updated.azubiId,
      category: NotificationCategory.review,
      title: 'Note bestätigt',
      message: `Ihre Note in ${updated.fach} wurde bestätigt.`,
      priority: 'medium',
      referenceType: 'Grade',
      referenceId: id,
    });
    return this.toResponse(updated);
  }

  async visieren(id: string, currentUser: CurrentUser): Promise<GradeResponseDto> {
    if (!currentUser.roles.includes(Role.ausbilder)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder dürfen final visieren' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    if (grade.status !== 'bestaetigt') throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur bestätigte Noten können visiert werden' });
    const updated = await this.prisma.grade.update({ where: { id }, data: { status: 'visiert' } });
    await this.createVersion(updated);
    await this.audit.create(currentUser, { action: 'grade.status_change', entity: 'Grade', entityId: id, details: JSON.stringify({ from: 'bestaetigt', to: 'visiert' }) });
    await this.notifications.create({
      userId: updated.azubiId,
      category: NotificationCategory.review,
      title: 'Note visiert',
      message: `Ihre Note in ${updated.fach} wurde visiert.`,
      priority: 'medium',
      referenceType: 'Grade',
      referenceId: id,
    });
    return this.toResponse(updated);
  }

  async archivieren(id: string, currentUser: CurrentUser): Promise<GradeResponseDto> {
    if (!currentUser.roles.includes(Role.ausbilder)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder dürfen archivieren' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    if (grade.status !== 'visiert') throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur visierte Noten können archiviert werden' });
    const updated = await this.prisma.grade.update({ where: { id }, data: { status: 'archiviert' } });
    await this.createVersion(updated);
    await this.audit.create(currentUser, { action: 'grade.status_change', entity: 'Grade', entityId: id, details: JSON.stringify({ from: 'visiert', to: 'archiviert' }) });
    await this.notifications.create({
      userId: updated.azubiId,
      category: NotificationCategory.review,
      title: 'Note archiviert',
      message: `Ihre Note in ${updated.fach} wurde archiviert.`,
      priority: 'medium',
      referenceType: 'Grade',
      referenceId: id,
    });
    return this.toResponse(updated);
  }

  async bewerten(id: string, currentUser: CurrentUser, dto: { bewertung: string; pruefungsdatum?: Date }): Promise<GradeResponseDto> {
    if (!this.canManage(currentUser)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR dürfen bewerten' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    const updated = await this.prisma.grade.update({ where: { id }, data: { bewertung: dto.bewertung, bewertetVon: currentUser.id, bewertetAm: new Date(), pruefungsdatum: dto.pruefungsdatum ?? null } });
    await this.audit.create(currentUser, { action: 'grade.bewerten', entity: 'Grade', entityId: id, details: JSON.stringify({ bewertung: dto.bewertung }) });
    return this.toResponse(updated);
  }

  async zeugnisUpload(id: string, currentUser: CurrentUser, dto: { zeugnisUrl: string }): Promise<GradeResponseDto> {
    if (!this.canManage(currentUser)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR dürfen Zeugnisse hochladen' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    if (grade.status === 'archiviert') throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Archivierte Noten können nicht mehr geändert werden' });
    const updated = await this.prisma.grade.update({ where: { id }, data: { zeugnisUrl: dto.zeugnisUrl } });
    await this.audit.create(currentUser, { action: 'grade.zeugnis_upload', entity: 'Grade', entityId: id, details: JSON.stringify({ zeugnisUrl: dto.zeugnisUrl }) });
    return this.toResponse(updated);
  }

  async wiederholung(id: string, currentUser: CurrentUser, dto: { maßnahme?: string }): Promise<GradeResponseDto> {
    if (!this.canManage(currentUser)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR dürfen Wiederholungen dokumentieren' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    const updated = await this.prisma.grade.update({ where: { id }, data: { wiederholung: true, maßnahme: dto.maßnahme ?? null } });
    await this.audit.create(currentUser, { action: 'grade.wiederholung', entity: 'Grade', entityId: id, details: JSON.stringify({ maßnahme: dto.maßnahme }) });
    return this.toResponse(updated);
  }

  async addMaßnahme(id: string, currentUser: CurrentUser, dto: { maßnahme: string }): Promise<GradeResponseDto> {
    if (!this.canManage(currentUser)) throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur Ausbilder/HR dürfen Fördermaßnahmen dokumentieren' });
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    const updated = await this.prisma.grade.update({ where: { id }, data: { maßnahme: dto.maßnahme } });
    await this.audit.create(currentUser, { action: 'grade.maßnahme', entity: 'Grade', entityId: id, details: JSON.stringify({ maßnahme: dto.maßnahme }) });
    return this.toResponse(updated);
  }

  async getVersions(id: string, currentUser: CurrentUser): Promise<GradeVersionResponseDto[]> {
    await this.scope.assertCanAccessAzubi(currentUser, id);
    const versions = await this.prisma.gradeVersion.findMany({ where: { gradeId: id }, orderBy: { version: 'asc' } });
    return versions.map((v) => this.toVersionResponse(v));
  }

  async getDiff(id: string, currentUser: CurrentUser, v1: number, v2: number): Promise<{ v1: string; v2: string }> {
    await this.scope.assertCanAccessAzubi(currentUser, id);
    const [a, b] = await Promise.all([
      this.prisma.gradeVersion.findFirst({ where: { gradeId: id, version: v1 } }),
      this.prisma.gradeVersion.findFirst({ where: { gradeId: id, version: v2 } }),
    ]);
    return { v1: a?.bemerkungen ?? '', v2: b?.bemerkungen ?? '' };
  }

  async getGPA(azubiId: string, currentUser: CurrentUser): Promise<{ gesamt: number; erstesHalbjahr: number | null; zweitesHalbjahr: number | null; anzahlNoten: number }> {
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);
    const grades = await this.prisma.grade.findMany({ where: { azubiId, status: { in: ['bestaetigt', 'visiert', 'archiviert'] as any[] } } });
    if (grades.length === 0) return { gesamt: 0, erstesHalbjahr: null, zweitesHalbjahr: null, anzahlNoten: 0 };
    const gS = grades.reduce((s, g) => s + (g.note * (g.gewichtung ?? 1.0)), 0);
    const gW = grades.reduce((s, g) => s + (g.gewichtung ?? 1.0), 0);
    const gesamt = gW > 0 ? Math.round((gS / gW) * 100) / 100 : 0;
    const erstes = grades.filter((g) => g.halbjahr === 'erstes');
    const zweites = grades.filter((g) => g.halbjahr === 'zweites');
    const erstesGPA = erstes.length > 0 ? Math.round((erstes.reduce((s, g) => s + g.note * (g.gewichtung ?? 1.0), 0) / erstes.reduce((s, g) => s + (g.gewichtung ?? 1.0), 0)) * 100) / 100 : null;
    const zweitesGPA = zweites.length > 0 ? Math.round((zweites.reduce((s, g) => s + g.note * (g.gewichtung ?? 1.0), 0) / zweites.reduce((s, g) => s + (g.gewichtung ?? 1.0), 0)) * 100) / 100 : null;
    return { gesamt, erstesHalbjahr: erstesGPA, zweitesHalbjahr: zweitesGPA, anzahlNoten: grades.length };
  }

  async getDashboard(currentUser: CurrentUser, filter?: { fach?: string; halbjahr?: any; zeitraum?: string }) {
    const where = await this.scopeWhere(currentUser) as any;
    if (filter?.fach) where.fach = filter.fach;
    if (filter?.halbjahr) where.halbjahr = filter.halbjahr;
    if (filter?.zeitraum) where.zeitraum = filter.zeitraum;
    const [noten, anzahlProStatus] = await this.prisma.$transaction([
      this.prisma.grade.findMany({ where, orderBy: { zeitraum: 'desc' } }),
      this.prisma.grade.groupBy({ by: ['status'], where, orderBy: { status: 'asc' as any }, _count: { id: true } }),
    ]);
    const statusMap: Record<string, number> = {};
    for (const g of anzahlProStatus) statusMap[g.status] = (g._count as any).id;
    const fachMap: Record<string, number[]> = {};
    for (const g of noten) { if (!fachMap[g.fach]) fachMap[g.fach] = []; fachMap[g.fach].push(g.note); }
    const fachDurchschnitte: Record<string, number> = {};
    for (const [fach, n] of Object.entries(fachMap)) fachDurchschnitte[fach] = Math.round((n.reduce((a, b) => a + b, 0) / n.length) * 100) / 100;
    return { zusammenfassung: { insgesamt: noten.length, nachStatus: statusMap, nachFach: fachDurchschnitte }, noten };
  }

  async exportCsv(currentUser: CurrentUser, azubiId?: string): Promise<string> {
    const where = await this.scopeWhere(currentUser);
    if (azubiId) {
      await this.scope.assertCanAccessAzubi(currentUser, azubiId);
      where.azubiId = azubiId;
    }
    const grades = await this.prisma.grade.findMany({ where, orderBy: { zeitraum: 'desc' } });
    const headers = ['fach','note','zeitraum','halbjahr','typ','gewichtung','gewichtungsKategorie','status','datum','pruefungsart','wiederholung','maßnahme','zeugnisUrl','bewertung','bewertetAm','createdAt'];
    const rows = grades.map((g) => [
      g.fach, g.note.toString(), g.zeitraum, g.halbjahr ?? '', g.typ, (g.gewichtung ?? 1.0).toString(),
      g.gewichtungsKategorie ?? '', g.status, g.datum?.toISOString() ?? '', g.pruefungsart ?? '',
      g.wiederholung ? 'true' : '', g.maßnahme ?? '', g.zeugnisUrl ?? '', g.bewertung ?? '',
      g.bewertetAm?.toISOString() ?? '', g.createdAt.toISOString(),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(';'));
    return [headers.join(';'), ...rows].join('\n');
  }

  async exportPdf(currentUser: CurrentUser, id: string): Promise<Buffer> {
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    await this.scope.assertCanAccessAzubi(currentUser, grade.azubiId);
    const lines = [
      `Zeugnis: ${grade.fach}`,
      `Note: ${grade.note}`,
      `Zeitraum: ${grade.zeitraum}`,
      `Halbjahr: ${grade.halbjahr ?? '—'}`,
      `Typ: ${grade.typ}`,
      `Gewichtung: ${grade.gewichtung ?? 1.0}`,
      `Status: ${grade.status}`,
      `Datum: ${grade.datum?.toISOString() ?? '—'}`,
      `Prüfungsart: ${grade.pruefungsart ?? '—'}`,
      `Wiederholung: ${grade.wiederholung ? 'Ja' : 'Nein'}`,
      `Bewertung: ${grade.bewertung ?? '—'}`,
      `Bewertet von: ${grade.bewertetVon ?? '—'}`,
      `Bewertet am: ${grade.bewertetAm?.toISOString() ?? '—'}`,
    ];
    return buildSimplePdf(`Zeugnis — ${grade.fach}`, lines);
  }

  async exportDsgvo(currentUser: CurrentUser, azubiId: string): Promise<string> {
    if (!currentUser.roles.includes(Role.hr) && !currentUser.roles.includes(Role.admin)) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur HR/Admin dürfen DSGVO-Export' });
    }
    const grades = await this.prisma.grade.findMany({ where: { azubiId } });
    const data = grades.map((g) => ({
      id: g.id, fach: g.fach, note: g.note, zeitraum: g.zeitraum, halbjahr: g.halbjahr,
      typ: g.typ, status: g.status, datum: g.datum, pruefungsart: g.pruefungsart,
      gewichtung: g.gewichtung, bewertung: g.bewertung, bewertetVon: g.bewertetVon,
      bewertetAm: g.bewertetAm, wiederholung: g.wiederholung, maßnahme: g.maßnahme,
      zeugnisUrl: g.zeugnisUrl, quellenUrl: g.quellenUrl, kursId: g.kursId,
      createdAt: g.createdAt, updatedAt: g.updatedAt,
    }));
    return JSON.stringify(data, null, 2);
  }

  async anonymizeDsgvo(currentUser: CurrentUser, id: string): Promise<void> {
    if (!currentUser.roles.includes(Role.hr) && !currentUser.roles.includes(Role.admin)) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur HR/Admin dürfen DSGVO-Anonymisierung' });
    }
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    await this.prisma.grade.update({
      where: { id },
      data: {
        azubiId: `anonymized-${id}`,
        fach: `anonymized-${grade.fach}`,
        bemerkungen: null,
        maßnahme: null,
        beschreibung: null,
        quellenUrl: null,
        zeugnisUrl: null,
      },
    });
    await this.audit.create(currentUser, { action: 'grade.anonymize', entity: 'Grade', entityId: id, details: JSON.stringify({ reason: 'DSGVO' }) });
  }

  async deleteDsgvo(currentUser: CurrentUser, id: string): Promise<void> {
    if (!currentUser.roles.includes(Role.hr) && !currentUser.roles.includes(Role.admin)) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Nur HR/Admin dürfen DSGVO-Löschung' });
    }
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade) throw new NotFoundException({ errorCode: ERROR_CODES.GRADE_NOT_FOUND, message: `Note ${id} nicht gefunden` });
    if (grade.status === 'archiviert') throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Archivierte Noten können nicht gelöscht werden (Art. 17 Ausnahmeregelung)' });
    await this.prisma.grade.delete({ where: { id } });
    await this.audit.create(currentUser, { action: 'grade.delete', entity: 'Grade', entityId: id, details: JSON.stringify({ reason: 'DSGVO Art.17' }) });
  }

  private async createVersion(grade: any): Promise<void> {
    const versions = await this.prisma.gradeVersion.findMany({ where: { gradeId: grade.id }, orderBy: { version: 'desc' }, take: 1 });
    const nextVersion = versions.length > 0 ? versions[0].version + 1 : 1;
    await this.prisma.gradeVersion.create({
      data: {
        gradeId: grade.id, version: nextVersion,
        fach: grade.fach, note: grade.note, status: grade.status,
        zeitraum: grade.zeitraum, halbjahr: grade.halbjahr,
        datum: grade.datum, pruefungsart: grade.pruefungsart,
        gewichtung: grade.gewichtung ?? 1.0,
        gewichtungsKategorie: grade.gewichtungsKategorie,
        typ: grade.typ, bemerkungen: grade.bemerkungen,
        prueferId: grade.prueferId, pruefungsdatum: grade.pruefungsdatum,
        wiederholung: grade.wiederholung, maßnahme: grade.maßnahme,
        zeugnisUrl: grade.zeugnisUrl, bewertetVon: grade.bewertetVon,
        bewertetAm: grade.bewertetAm, erstelltVon: grade.bewertetVon,
      },
    });
  }

  private async scopeWhere(currentUser: CurrentUser): Promise<any> {
    if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) return { azubiId: currentUser.azubiId };
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    if (visible === 'ALL') return {};
    return { azubiId: { in: [...visible] } };
  }

  private canManage(user: CurrentUser): boolean {
    return user.roles.some((r) => r === Role.ausbilder || r === Role.hr || r === Role.admin);
  }

  private toResponse(g: any): GradeResponseDto {
    return {
      id: g.id, azubiId: g.azubiId, fach: g.fach, note: g.note, zeitraum: g.zeitraum,
      halbjahr: (g.halbjahr as any) as any, datum: g.datum, pruefungsart: (g.pruefungsart as any) as any,
      gewichtung: g.gewichtung ?? 1.0, gewichtungsKategorie: (g.gewichtungsKategorie as any) as any,
      typ: (g.typ as any) as any, status: (g.status as any) as any, beschreibung: g.beschreibung,
      bemerkungen: g.bemerkungen, prueferId: g.prueferId, pruefungsdatum: g.pruefungsdatum,
      wiederholung: g.wiederholung, maßnahme: g.maßnahme, zeugnisUrl: g.zeugnisUrl,
      quellenUrl: g.quellenUrl, kursId: g.kursId, bewertetVon: g.bewertetVon,
      bewertetAm: g.bewertetAm, bewertung: g.bewertung ?? null, createdAt: g.createdAt, updatedAt: g.updatedAt,
    };
  }

  private toVersionResponse(v: any): GradeVersionResponseDto {
    return {
      id: v.id, gradeId: v.gradeId, version: v.version, fach: v.fach, note: v.note,
      status: (v.status as any) as any, zeitraum: v.zeitraum, halbjahr: (v.halbjahr as any) as any,
      datum: v.datum, pruefungsart: (v.pruefungsart as any) as any, gewichtung: v.gewichtung ?? 1.0,
      gewichtungsKategorie: (v.gewichtungsKategorie as any) as any, typ: (v.typ as any) as any,
      bemerkungen: v.bemerkungen, prueferId: v.prueferId, pruefungsdatum: v.pruefungsdatum,
      wiederholung: v.wiederholung, maßnahme: v.maßnahme, zeugnisUrl: v.zeugnisUrl,
      bewertetVon: v.bewertetVon, bewertetAm: v.bewertetAm, erstelltVon: v.erstelltVon, createdAt: v.createdAt,
    };
  }
}
