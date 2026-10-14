import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AbwesenheitTyp,
  Prisma,
  NotificationCategory,
  ReportDayArt,
  ReportStatus,
  ReportTyp,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { AppConfig } from '../../config/configuration.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { buildSimplePdf } from '../../common/utils/pdf.js';
import { withPagination } from '../../common/dto/pagination-query.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import {
  AddCommentDto,
  CreateReportDto,
  ReportDayResponseDto,
  ReportResponseDto,
  ReviewReportDto,
  SaveReportDaysDto,
  UpdateReportDto,
} from './dto/report.dto.js';
import {
  DAY_ART_LABELS,
  formatMinutes,
  isoWeekDays,
  isoWeekRange,
  renderWeekMarkdown,
  toIsoDate,
  validateWeek,
  type ReportLimits,
  type WeekValidationResult,
} from './report-week.js';

const WORKING_DAYS_PER_WEEK = 5;

const ABSENCE_TO_DAY_ART: Readonly<Record<AbwesenheitTyp, ReportDayArt>> = {
  urlaub: ReportDayArt.urlaub,
  krank: ReportDayArt.krank,
  berufsschule: ReportDayArt.berufsschule,
};

const REPORT_DETAIL_INCLUDE = {
  reportTasks: true,
  tage: {
    orderBy: { datum: 'asc' },
    include: {
      aktivitaeten: {
        orderBy: { sortierung: 'asc' },
        include: { task: { select: { titel: true } } },
      },
    },
  },
} satisfies Prisma.ReportInclude;

const REPORT_LIST_INCLUDE = {
  reportTasks: true,
  tage: { select: { aktivitaeten: { select: { dauerMinuten: true } } } },
} satisfies Prisma.ReportInclude;

type ReportDetail = Prisma.ReportGetPayload<{ include: typeof REPORT_DETAIL_INCLUDE }>;
type ReportListItem = Prisma.ReportGetPayload<{ include: typeof REPORT_LIST_INCLUDE }>;

@Injectable()
export class BerichteService {
  private readonly limits: ReportLimits;

  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
    configService: ConfigService,
  ) {
    const reports = configService.get<AppConfig['reports']>('reports');
    this.limits = {
      maxMinutesPerDay: reports?.maxMinutesPerDay ?? 600,
      maxMinutesPerDayMinor: reports?.maxMinutesPerDayMinor ?? 480,
      maxMinutesPerWeekMinor: reports?.maxMinutesPerWeekMinor ?? 2400,
    };
  }

  async create(
    currentUser: CurrentUser,
    dto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    if (!currentUser.roles.includes(Role.azubi) || !currentUser.azubiId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Azubis dürfen Berichte erstellen',
      });
    }
    const azubiId = currentUser.azubiId;

    let range: { montag: Date; sonntag: Date };
    try {
      range = isoWeekRange(dto.jahr, dto.kalenderwoche);
    } catch (error) {
      throw new BusinessException(
        ERROR_CODES.REPORT_INVALID_DAY,
        error instanceof Error ? error.message : 'Ungültige Kalenderwoche',
        400,
      );
    }

    const existing = await this.prisma.report.findUnique({
      where: { azubiId_jahr_kalenderwoche: { azubiId, jahr: dto.jahr, kalenderwoche: dto.kalenderwoche } },
      select: { id: true },
    });
    if (existing) {
      throw new BusinessException(
        ERROR_CODES.REPORT_WEEK_EXISTS,
        `Für KW ${dto.kalenderwoche}/${dto.jahr} existiert bereits ein Bericht`,
        409,
        { reportId: existing.id },
      );
    }

    const workingDays = isoWeekDays(dto.jahr, dto.kalenderwoche).slice(0, WORKING_DAYS_PER_WEEK);
    const absences = await this.prisma.abwesenheit.findMany({
      where: { azubiId, von: { lte: range.sonntag }, bis: { gte: range.montag } },
      select: { typ: true, von: true, bis: true },
    });

    const report = await this.prisma.report.create({
      data: {
        azubiId,
        titel: dto.titel,
        typ: dto.typ ?? ReportTyp.betrieb,
        kalenderwoche: dto.kalenderwoche,
        jahr: dto.jahr,
        datumVon: range.montag,
        datumBis: range.sonntag,
        inhaltMarkdown: '',
        status: ReportStatus.entwurf,
        tage: {
          create: workingDays.map((datum) => ({
            datum: new Date(`${datum}T00:00:00Z`),
            art: this.prefillDayArt(datum, absences),
          })),
        },
      },
      include: REPORT_DETAIL_INCLUDE,
    });

    const withMarkdown = await this.prisma.report.update({
      where: { id: report.id },
      data: { inhaltMarkdown: renderWeekMarkdown(this.toRenderable(report)) },
      include: REPORT_DETAIL_INCLUDE,
    });

    await this.audit.create(currentUser, {
      action: 'REPORT_CREATED',
      entity: 'report',
      entityId: report.id,
    });

    return this.toDetailResponse(withMarkdown, await this.loadGeburtsdatum(azubiId));
  }

  async findAll(
    currentUser: CurrentUser,
    query: PaginationQueryDto,
    filter: { azubiId?: string; status?: ReportStatus; jahr?: number; typ?: ReportTyp },
  ) {
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    const where: Prisma.ReportWhereInput = {};

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
        include: REPORT_LIST_INCLUDE,
        orderBy: [{ jahr: 'desc' }, { kalenderwoche: 'desc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return withPagination(
      items.map((r) => this.toListResponse(r)),
      query.page,
      query.limit,
      total,
    );
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<ReportResponseDto> {
    await this.scope.assertCanAccessBericht(currentUser, id);
    const report = await this.load(id);
    return this.toDetailResponse(report, await this.loadGeburtsdatum(report.azubiId));
  }

  async update(
    id: string,
    currentUser: CurrentUser,
    dto: UpdateReportDto,
  ): Promise<ReportResponseDto> {
    const report = await this.loadOwned(currentUser, id, ReportStatus.entwurf);

    const updated = await this.prisma.report.update({
      where: { id },
      data: {
        ...(dto.titel !== undefined ? { titel: dto.titel } : {}),
        ...(dto.typ !== undefined ? { typ: dto.typ } : {}),
      },
      include: REPORT_DETAIL_INCLUDE,
    });

    await this.audit.create(currentUser, {
      action: 'REPORT_UPDATED',
      entity: 'report',
      entityId: id,
    });

    return this.toDetailResponse(updated, await this.loadGeburtsdatum(report.azubiId));
  }

  async saveDays(
    id: string,
    currentUser: CurrentUser,
    dto: SaveReportDaysDto,
  ): Promise<ReportResponseDto> {
    const report = await this.loadOwned(currentUser, id, ReportStatus.entwurf);
    const geburtsdatum = await this.loadGeburtsdatum(report.azubiId);

    const sortedTage = [...dto.tage]
      .sort((a, b) => a.datum.localeCompare(b.datum))
      .map((t) => ({
        ...t,
        aktivitaeten: t.aktivitaeten.map((a) => ({ ...a, beschreibung: a.beschreibung.trim() })),
      }));
    this.assertDescriptionsPresent(sortedTage);
    this.assertWeekValid(
      validateWeek(sortedTage, isoWeekDays(report.jahr, report.kalenderwoche), geburtsdatum, this.limits),
    );

    const taskIds = [
      ...new Set(sortedTage.flatMap((t) => t.aktivitaeten.map((a) => a.taskId)).filter((t): t is string => !!t)),
    ];
    await this.assertTasksReleased(taskIds);
    const taskTitles = await this.loadTaskTitles(taskIds);

    const inhaltMarkdown = renderWeekMarkdown(
      sortedTage.map((t) => ({
        datum: t.datum,
        art: t.art,
        aktivitaeten: t.aktivitaeten.map((a) => ({
          beschreibung: a.beschreibung,
          dauerMinuten: a.dauerMinuten,
          taskTitel: a.taskId ? (taskTitles.get(a.taskId) ?? null) : null,
        })),
      })),
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.reportDay.deleteMany({ where: { reportId: id } });
      for (const tag of sortedTage) {
        await tx.reportDay.create({
          data: {
            reportId: id,
            datum: new Date(`${tag.datum}T00:00:00Z`),
            art: tag.art,
            aktivitaeten: {
              create: tag.aktivitaeten.map((a, index) => ({
                beschreibung: a.beschreibung,
                dauerMinuten: a.dauerMinuten,
                sortierung: index,
                taskId: a.taskId ?? null,
              })),
            },
          },
        });
      }
      return tx.report.update({
        where: { id },
        data: {
          inhaltMarkdown,
          reportTasks: {
            deleteMany: {},
            create: taskIds.map((taskId) => ({ taskId })),
          },
        },
        include: REPORT_DETAIL_INCLUDE,
      });
    });

    await this.audit.create(currentUser, {
      action: 'REPORT_UPDATED',
      entity: 'report',
      entityId: id,
    });

    return this.toDetailResponse(updated, geburtsdatum);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    await this.loadOwned(currentUser, id, ReportStatus.entwurf);
    await this.prisma.report.delete({ where: { id } });

    await this.audit.create(currentUser, {
      action: 'REPORT_DELETED',
      entity: 'report',
      entityId: id,
    });
  }

  async submit(id: string, currentUser: CurrentUser): Promise<ReportResponseDto> {
    const report = await this.loadOwned(currentUser, id, ReportStatus.entwurf);
    const geburtsdatum = await this.loadGeburtsdatum(report.azubiId);

    this.assertWeekValid(
      validateWeek(
        report.tage.map((t) => ({
          datum: toIsoDate(t.datum),
          art: t.art,
          aktivitaeten: t.aktivitaeten,
        })),
        isoWeekDays(report.jahr, report.kalenderwoche),
        geburtsdatum,
        this.limits,
        { requireComplete: true },
      ),
    );

    const updated = await this.prisma.report.update({
      where: { id: report.id },
      data: { status: ReportStatus.eingereicht },
      include: REPORT_DETAIL_INCLUDE,
    });

    await this.notifyReviewers(
      report.titel,
      report.kalenderwoche,
      report.jahr,
      id,
    );

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

    return this.toDetailResponse(updated, geburtsdatum);
  }

  async addAttachment(
    id: string,
    user: CurrentUser,
    dto: { typ: string; dateiUrl: string; kommentar?: string },
  ): Promise<void> {
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

  async getAttachments(id: string, user: CurrentUser) {
    await this.scope.assertCanAccessBericht(user, id);
    return this.prisma.reportAttachment.findMany({
      where: { reportId: id },
    });
  }

  async addTimeEntry(
    id: string,
    user: CurrentUser,
    dto: { taskId?: string; stunden: number; kommentar?: string },
  ): Promise<void> {
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

  async getTimeEntries(id: string, user: CurrentUser) {
    await this.scope.assertCanAccessBericht(user, id);
    return this.prisma.reportTimeEntry.findMany({
      where: { reportId: id },
    });
  }

  async getVersions(id: string, user: CurrentUser) {
    await this.scope.assertCanAccessBericht(user, id);
    return this.prisma.reportVersion.findMany({
      where: { reportId: id },
      orderBy: { version: 'asc' },
    });
  }

  async getDiff(
    id: string,
    user: CurrentUser,
    v1: number,
    v2: number,
  ) {
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

  async review(
    id: string,
    currentUser: CurrentUser,
    dto: ReviewReportDto,
  ): Promise<ReportResponseDto> {
    if (!currentUser.roles.includes(Role.ausbildungsbeauftragter)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbildungsbeauftragte dürfen vorprüfen',
      });
    }
    await this.scope.assertCanAccessBericht(currentUser, id);

    const report = await this.load(id);
    if (report.status !== ReportStatus.eingereicht) {
      throw new BusinessException(
        ERROR_CODES.REPORT_NOT_IN_REVIEW,
        'Bericht ist nicht zur Prüfung eingereicht',
        409,
      );
    }

    const nextStatus =
      dto.entscheidung === 'freigeben'
        ? ReportStatus.in_pruefung
        : ReportStatus.entwurf;

    await this.addCommentInternal(id, currentUser, dto.kommentar, 'pruefung');

    const updated = await this.prisma.report.update({
      where: { id },
      data: { status: nextStatus },
      include: REPORT_DETAIL_INCLUDE,
    });

    await this.notifications.create({
      userId: updated.azubiId,
      category: NotificationCategory.review,
      title:
        nextStatus === ReportStatus.in_pruefung
          ? 'Bericht in Prüfung'
          : 'Bericht zur Überarbeitung zurückgegeben',
      message:
        nextStatus === ReportStatus.in_pruefung
          ? `Ihr Bericht „${updated.titel}“ (KW ${updated.kalenderwoche}/${updated.jahr}) wurde geprüft und geht in die abschließende Prüfung.`
          : `Ihr Bericht „${updated.titel}“ (KW ${updated.kalenderwoche}/${updated.jahr}) wurde zur Überarbeitung zurückgegeben.`,
      referenceType: 'report',
      referenceId: id,
    });

    return this.toDetailResponse(updated, await this.loadGeburtsdatum(updated.azubiId));
  }

  async visieren(
    id: string,
    currentUser: CurrentUser,
  ): Promise<ReportResponseDto> {
    if (!currentUser.roles.includes(Role.ausbilder)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder dürfen final visieren',
      });
    }
    await this.scope.assertCanAccessBericht(currentUser, id);

    const report = await this.load(id);
    if (report.status !== ReportStatus.in_pruefung) {
      throw new BusinessException(
        ERROR_CODES.REPORT_NOT_IN_REVIEW,
        'Bericht muss sich in Prüfung befinden',
        409,
      );
    }

    const updated = await this.prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.visiert,
        signiertVon: currentUser.id,
        signiertAm: new Date(),
      },
      include: REPORT_DETAIL_INCLUDE,
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

    return this.toDetailResponse(updated, await this.loadGeburtsdatum(updated.azubiId));
  }

  async archivieren(
    id: string,
    currentUser: CurrentUser,
  ): Promise<ReportResponseDto> {
    if (!currentUser.roles.includes(Role.ausbilder)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder dürfen archivieren',
      });
    }
    await this.scope.assertCanAccessBericht(currentUser, id);

    const report = await this.load(id);
    if (report.status !== ReportStatus.visiert) {
      throw new BusinessException(
        ERROR_CODES.REPORT_ALREADY_ARCHIVED,
        'Nur visierte Berichte können archiviert werden',
        409,
      );
    }

    const updated = await this.prisma.report.update({
      where: { id },
      data: { status: ReportStatus.archiviert, archiviertAm: new Date() },
      include: REPORT_DETAIL_INCLUDE,
    });

    await this.audit.create(currentUser, {
      action: 'REPORT_ARCHIVIERT',
      entity: 'report',
      entityId: id,
    });

    return this.toDetailResponse(updated, await this.loadGeburtsdatum(updated.azubiId));
  }

  async cancel(
    id: string,
    currentUser: CurrentUser,
  ): Promise<ReportResponseDto> {
    const report = await this.loadOwned(currentUser, id, ReportStatus.eingereicht);

    const updated = await this.prisma.report.update({
      where: { id: report.id },
      data: { status: ReportStatus.entwurf },
      include: REPORT_DETAIL_INCLUDE,
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

    return this.toDetailResponse(updated, await this.loadGeburtsdatum(updated.azubiId));
  }

  async addComment(
    id: string,
    currentUser: CurrentUser,
    dto: AddCommentDto,
  ): Promise<void> {
    const allowed =
      currentUser.roles.includes(Role.ausbildungsbeauftragter) ||
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

  async getComments(id: string, currentUser: CurrentUser) {
    await this.scope.assertCanAccessBericht(currentUser, id);
    return this.prisma.reportComment.findMany({
      where: { reportId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async exportPdf(id: string, currentUser: CurrentUser): Promise<Buffer> {
    await this.scope.assertCanAccessBericht(currentUser, id);
    const report = await this.load(id);
    const azubi = await this.prisma.user.findUnique({
      where: { id: report.azubiId },
      select: { firstName: true, lastName: true },
    });

    const wochenSumme = report.tage
      .flatMap((t) => t.aktivitaeten)
      .reduce((acc, a) => acc + a.dauerMinuten, 0);

    const lines = [
      `Auszubildende(r): ${azubi?.firstName ?? ''} ${azubi?.lastName ?? ''}`,
      `Kalenderwoche: ${report.kalenderwoche} / Jahr: ${report.jahr}   Status: ${report.status}`,
      `Zeitraum: ${toIsoDate(report.datumVon)} bis ${toIsoDate(report.datumBis)}`,
      '',
    ];
    for (const tag of report.tage) {
      const summe = tag.aktivitaeten.reduce((acc, a) => acc + a.dauerMinuten, 0);
      lines.push(`${toIsoDate(tag.datum)}  ${DAY_ART_LABELS[tag.art]}  (${formatMinutes(summe)})`);
      for (const a of tag.aktivitaeten) {
        const task = a.task ? `  [Task: ${a.task.titel}]` : '';
        lines.push(`    ${formatMinutes(a.dauerMinuten)}  ${a.beschreibung}${task}`);
      }
    }
    lines.push('', `Wochensumme: ${formatMinutes(wochenSumme)}`);

    return buildSimplePdf(`Berichtsheft - ${report.titel}`, lines);
  }

  private async loadOwned(
    currentUser: CurrentUser,
    id: string,
    expectedStatus: ReportStatus,
  ) {
    if (
      !currentUser.roles.includes(Role.azubi) ||
      !currentUser.azubiId
    ) {
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
      throw new BusinessException(
        ERROR_CODES.REPORT_NOT_EDITABLE,
        `Bericht ist nicht im Status ${expectedStatus}`,
        409,
      );
    }
    return report;
  }

  private async load(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: REPORT_DETAIL_INCLUDE,
    });
    if (!report) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.REPORT_NOT_FOUND,
        message: `Bericht ${id} nicht gefunden`,
      });
    }
    return report;
  }

  private async notifyReviewers(
    titel: string,
    kalenderwoche: number,
    jahr: number,
    reportId: string,
  ): Promise<void> {
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

  private async assertTasksReleased(taskIds: string[]): Promise<void> {
    if (taskIds.length === 0) {
      return;
    }
    const released = await this.prisma.task.count({
      where: { id: { in: taskIds }, freigegeben: true },
    });
    if (released !== taskIds.length) {
      throw new BusinessException(
        ERROR_CODES.TASK_NOT_FOUND,
        'Ein oder mehrere Tasks sind nicht freigegeben',
        409,
      );
    }
  }

  private async addCommentInternal(
    reportId: string,
    currentUser: CurrentUser,
    text: string | undefined,
    art: string,
  ): Promise<void> {
    if (!text) {
      return;
    }
    await this.prisma.reportComment.create({
      data: { reportId, authorId: currentUser.id, text, art },
    });
  }

  async getReviewQueue(
    currentUser: CurrentUser,
    query: PaginationQueryDto,
    filter: { azubiId?: string; jahr?: number; kalenderwoche?: number },
  ) {
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    const where: Prisma.ReportWhereInput = {
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
          ...REPORT_LIST_INCLUDE,
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
      ...this.toListResponse(r),
      azubiName: `${r.azubi.firstName} ${r.azubi.lastName}`,
    }));

    return withPagination(mapped, query.page, query.limit, total);
  }

  async batchReview(
    currentUser: CurrentUser,
    dto: { reportIds: string[]; entscheidung: 'freigeben' | 'zurueck'; kommentar?: string },
  ) {
    if (dto.reportIds.length > 100) {
      throw new BusinessException(
        ERROR_CODES.VALIDATION_FAILED,
        'Maximal 100 Berichte pro Batch',
        400,
      );
    }

    const results: Array<{ reportId: string; success: boolean; error?: string }> = [];

    for (const reportId of dto.reportIds) {
      try {
        await this.review(reportId, currentUser, {
          entscheidung: dto.entscheidung,
          kommentar: dto.kommentar,
        });
        results.push({ reportId, success: true });
      } catch (error) {
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

  async exportReviewCsv(currentUser: CurrentUser): Promise<string> {
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    const where: Prisma.ReportWhereInput = {};

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

  private toBaseResponse(report: {
    id: string;
    azubiId: string;
    titel: string;
    typ: ReportTyp;
    kalenderwoche: number;
    jahr: number;
    datumVon: Date;
    datumBis: Date;
    inhaltMarkdown: string;
    status: ReportStatus;
    signiertVon: string | null;
    signiertAm: Date | null;
    archiviertAm: Date | null;
    reportTasks: Array<{ taskId: string }>;
    createdAt: Date;
  }): Omit<ReportResponseDto, 'summeMinuten' | 'maxMinutenWoche' | 'tage'> {
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

  private toListResponse(report: ReportListItem): ReportResponseDto {
    const summeMinuten = report.tage
      .flatMap((t) => t.aktivitaeten)
      .reduce((acc, a) => acc + a.dauerMinuten, 0);
    return { ...this.toBaseResponse(report), summeMinuten, maxMinutenWoche: null };
  }

  private toDetailResponse(report: ReportDetail, geburtsdatum: string | null): ReportResponseDto {
    const weekDays = isoWeekDays(report.jahr, report.kalenderwoche);
    const summary = validateWeek(
      report.tage.map((t) => ({ datum: toIsoDate(t.datum), art: t.art, aktivitaeten: t.aktivitaeten })),
      weekDays,
      geburtsdatum,
      this.limits,
    );
    const maxByDate = new Map(summary.tage.map((s) => [s.datum, s]));

    const tage: ReportDayResponseDto[] = report.tage.map((t) => {
      const datum = toIsoDate(t.datum);
      return {
        id: t.id,
        datum,
        art: t.art,
        summeMinuten: maxByDate.get(datum)?.summeMinuten ?? 0,
        maxMinuten: maxByDate.get(datum)?.maxMinuten ?? this.limits.maxMinutesPerDay,
        aktivitaeten: t.aktivitaeten.map((a) => ({
          id: a.id,
          beschreibung: a.beschreibung,
          dauerMinuten: a.dauerMinuten,
          sortierung: a.sortierung,
          taskId: a.taskId,
          taskTitel: a.task?.titel ?? null,
        })),
      };
    });

    return {
      ...this.toBaseResponse(report),
      summeMinuten: summary.summeMinuten,
      maxMinutenWoche: summary.maxMinutenWoche,
      tage,
    };
  }

  private toRenderable(report: ReportDetail) {
    return report.tage.map((t) => ({
      datum: toIsoDate(t.datum),
      art: t.art,
      aktivitaeten: t.aktivitaeten.map((a) => ({
        beschreibung: a.beschreibung,
        dauerMinuten: a.dauerMinuten,
        taskTitel: a.task?.titel ?? null,
      })),
    }));
  }

  private prefillDayArt(
    datum: string,
    absences: ReadonlyArray<{ typ: AbwesenheitTyp; von: Date; bis: Date }>,
  ): ReportDayArt {
    const match = absences.find((a) => toIsoDate(a.von) <= datum && datum <= toIsoDate(a.bis));
    return match ? ABSENCE_TO_DAY_ART[match.typ] : ReportDayArt.betrieb;
  }

  private async loadGeburtsdatum(azubiId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: azubiId },
      select: { geburtsdatum: true },
    });
    return user?.geburtsdatum ? toIsoDate(user.geburtsdatum) : null;
  }

  private async loadTaskTitles(taskIds: string[]): Promise<Map<string, string>> {
    if (taskIds.length === 0) {
      return new Map();
    }
    const tasks = await this.prisma.task.findMany({
      where: { id: { in: taskIds } },
      select: { id: true, titel: true },
    });
    return new Map(tasks.map((t) => [t.id, t.titel]));
  }

  private assertDescriptionsPresent(
    tage: ReadonlyArray<{ datum: string; aktivitaeten: ReadonlyArray<{ beschreibung: string }> }>,
  ): void {
    const empty = tage.find((t) => t.aktivitaeten.some((a) => a.beschreibung.length === 0));
    if (empty) {
      throw new BusinessException(
        ERROR_CODES.VALIDATION_FAILED,
        `${empty.datum}: Aktivität ohne Beschreibung`,
        400,
      );
    }
  }

  private assertWeekValid(result: WeekValidationResult): void {
    const [first] = result.errors;
    if (!first) {
      return;
    }
    const status = first.code === 'REPORT_INCOMPLETE' ? 409 : 400;
    throw new BusinessException(
      ERROR_CODES[first.code],
      result.errors.map((e) => e.message).join('; '),
      status,
      result.errors,
    );
  }
}
