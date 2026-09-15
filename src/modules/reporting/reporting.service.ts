import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import {
  AbteilungsZufriedenheitDto,
  DashboardResult,
  ExportKindDto,
  ExportQueryDto,
  FruchwarnDto,
  ReportQuoteDto,
  SkillCoverageDto,
  toCsv,
} from './dto/reporting.dto.js';

const ISO_WEEKS_PER_YEAR = 52;

@Injectable()
export class ReportingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async getDashboard(currentUser: CurrentUser): Promise<DashboardResult> {
    if (currentUser.roles.includes(Role.azubi)) {
      return this.azubiDashboard(currentUser);
    }
    if (currentUser.roles.includes(Role.ausbildungsbeauftragter)) {
      return this.ausbildungsbeauftragterDashboard(currentUser);
    }
    return this.ausbilderHrDashboard(currentUser);
  }

  // ---- KPIs ----

  async reportQuote(
    currentUser: CurrentUser,
    year?: number,
  ): Promise<ReportQuoteDto[]> {
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    const azubis = await this.prisma.user.findMany({
      where: {
        roles: { some: { role: Role.azubi } },
        ...(visible !== 'ALL' ? { id: { in: [...visible] } } : {}),
      },
      select: { id: true, firstName: true, lastName: true },
      orderBy: { lastName: 'asc' },
    });
    const targetYear = year ?? new Date().getFullYear();

    const result: ReportQuoteDto[] = [];
    for (const azubi of azubis) {
      const eingereicht = await this.prisma.report.count({
        where: {
          azubiId: azubi.id,
          jahr: targetYear,
          status: {
            in: ['eingereicht', 'in_pruefung', 'visiert', 'archiviert'],
          },
        },
      });
      result.push({
        azubiId: azubi.id,
        name: `${azubi.firstName} ${azubi.lastName}`,
        year: targetYear,
        kalenderwochen: ISO_WEEKS_PER_YEAR,
        eingereicht,
        quote: Math.min(1, eingereicht / ISO_WEEKS_PER_YEAR),
      });
    }
    return result;
  }

  async skillCoverage(currentUser: CurrentUser): Promise<SkillCoverageDto[]> {
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    const azubiWhere: Prisma.ReportWhereInput =
      visible === 'ALL' ? {} : { azubiId: { in: [...visible] } };

    const courses = await this.prisma.course.findMany({
      where: { freigegeben: true },
      include: { framework: true, tasks: { where: { freigegeben: true } } },
      orderBy: { titel: 'asc' },
    });

    const result: SkillCoverageDto[] = [];
    for (const course of courses) {
      const taskIds = course.tasks.map((t) => t.id);
      const used = await this.prisma.reportTask.count({
        where: {
          taskId: { in: taskIds },
          report: azubiWhere,
        },
      });
      result.push({
        courseId: course.id,
        courseTitle: course.titel,
        frameworkTitel: course.framework.titel,
        tasksTotal: course.tasks.length,
        reportsUsing: used,
        coverage:
          course.tasks.length > 0
            ? Math.min(1, used / course.tasks.length)
            : 0,
      });
    }
    return result;
  }

  async abteilungsZufriedenheit(
    currentUser: CurrentUser,
  ): Promise<AbteilungsZufriedenheitDto[]> {
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    const feedbackWhere: Prisma.FeedbackWhereInput = {
      typ: 'abteilungsbewertung',
      ...(visible !== 'ALL' ? { anUserId: { in: [...visible] } } : {}),
    };
    const groups = await this.prisma.feedback.groupBy({
      by: ['abteilungId'],
      where: feedbackWhere,
      _count: { _all: true },
      _avg: { fachkompetenz: true, softskills: true },
    });

    const result: AbteilungsZufriedenheitDto[] = [];
    for (const group of groups) {
      if (!group.abteilungId) {
        continue;
      }
      const abteilung = await this.prisma.abteilung.findUnique({
        where: { id: group.abteilungId },
        select: { name: true },
      });
      result.push({
        abteilungId: group.abteilungId,
        name: abteilung?.name ?? 'Unbekannt',
        count: group._count._all,
        avgFachkompetenz: Math.round((group._avg.fachkompetenz ?? 0) * 100) / 100,
        avgSoftskills: Math.round((group._avg.softskills ?? 0) * 100) / 100,
      });
    }
    return result;
  }

  // ---- Exporte ----

  async exportCsv(
    currentUser: CurrentUser,
    dto: ExportKindDto,
    query: ExportQueryDto,
  ): Promise<{ filename: string; csv: string }> {
    switch (dto.kind) {
      case 'attendance': {
        const scopedWhere = await this.scopedAzubiWhere(currentUser);
        const abwesenheiten = await this.prisma.abwesenheit.findMany({
          where: {
            ...scopedWhere,
            ...(query.jahr
              ? {
                  von: {
                    gte: new Date(`${query.jahr}-01-01`),
                    lt: new Date(`${query.jahr}-12-31`),
                  },
                }
              : {}),
          },
          include: { azubi: { select: { firstName: true, lastName: true } } },
          orderBy: { von: 'asc' },
        });
        const rows = abwesenheiten.map((a) => ({
          azubiId: a.azubiId,
          name: `${a.azubi.firstName} ${a.azubi.lastName}`,
          typ: a.typ,
          quelle: a.quelle,
          von: a.von.toISOString(),
          bis: a.bis.toISOString(),
        }));
        return {
          filename: `abwesenheiten-${new Date().toISOString().slice(0, 10)}.csv`,
          csv: toCsv(rows),
        };
      }
      case 'grades': {
        const scopedWhere = await this.scopedAzubiWhere(currentUser);
        const noten = await this.prisma.grade.findMany({
          where: scopedWhere,
          include: { azubi: { select: { firstName: true, lastName: true } } },
          orderBy: { createdAt: 'asc' },
        });
        const rows = noten.map((g) => ({
          azubiId: g.azubiId,
          name: `${g.azubi.firstName} ${g.azubi.lastName}`,
          fach: g.fach,
          note: g.note,
          zeitraum: g.zeitraum,
          zeugnisUrl: g.zeugnisUrl ?? '',
        }));
        return {
          filename: `noten-${new Date().toISOString().slice(0, 10)}.csv`,
          csv: toCsv(rows),
        };
      }
      case 'competency': {
        const coverage = await this.skillCoverage(currentUser);
        const rows = coverage.map((c) => ({
          courseId: c.courseId,
          courseTitle: c.courseTitle,
          frameworkTitel: c.frameworkTitel,
          tasksTotal: c.tasksTotal,
          reportsUsing: c.reportsUsing,
          coverage: c.coverage,
        }));
        return {
          filename: `kompetenz-${new Date().toISOString().slice(0, 10)}.csv`,
          csv: toCsv(rows),
        };
      }
      default:
        return { filename: 'export.csv', csv: '' };
    }
  }

  // ---- Intern / Dashboards ----

  private async azubiDashboard(user: CurrentUser): Promise<DashboardResult> {
    const azubiId = user.azubiId ?? user.id;
    const [offeneBerichte, skills, noten] = await this.prisma.$transaction([
      this.prisma.report.count({
        where: { azubiId, status: { not: 'archiviert' } },
      }),
      this.prisma.task.count({ where: { freigegeben: true } }),
      this.prisma.grade.findMany({
        where: { azubiId },
        select: { note: true },
      }),
    ]);
    const notenSchnitt =
      noten.length > 0
        ? Math.round((noten.reduce((s, g) => s + g.note, 0) / noten.length) * 100) / 100
        : 0;
    return {
      role: 'azubi',
      stats: { offeneBerichte, skills, notenAnzahl: noten.length, notenSchnitt },
      warnings: [],
    };
  }

  private async ausbildungsbeauftragterDashboard(
    user: CurrentUser,
  ): Promise<DashboardResult> {
    const visible = await this.scope.getVisibleAzubiIds(user);
    const openVisa = await this.prisma.report.count({
      where: {
        status: 'eingereicht',
        ...(visible !== 'ALL' ? { azubiId: { in: [...visible] } } : {}),
      },
    });
    const kommendeRotationen = await this.prisma.einsatz.count({
      where: {
        abteilungId: { in: user.abteilungIds },
        von: { gte: new Date() },
      },
    });
    return {
      role: 'ausbildungsbeauftragter',
      stats: { openVisa, kommendeRotationen },
      warnings: [],
    };
  }

  private async ausbilderHrDashboard(
    user: CurrentUser,
  ): Promise<DashboardResult> {
    const visible = await this.scope.getVisibleAzubiIds(user);
    const azubiScope = visible !== 'ALL' ? { azubiId: { in: [...visible] } } : {};

    const [fehlendeBerichte, offeneVisa, azubiGesamt, durchschnitt] =
      await this.prisma.$transaction([
        this.prisma.report.count({
          where: { ...azubiScope, status: 'entwurf' },
        }),
        this.prisma.report.count({
          where: { ...azubiScope, status: 'eingereicht' },
        }),
        this.prisma.user.count({
          where: { roles: { some: { role: Role.azubi } } },
        }),
        this.prisma.grade.aggregate({ _avg: { note: true } }),
      ]);

    const warnings: FruchwarnDto[] = await this.collectWarnings(
      visible !== 'ALL' ? [...visible] : null,
    );

    return {
      role: 'ausbilder_hr',
      stats: {
        azubiGesamt,
        fehlendeBerichte,
        offeneVisa,
        notenSchnitt:
          Math.round((durchschnitt._avg.note ?? 0) * 100) / 100,
      },
      warnings,
    };
  }

  private async collectWarnings(
    azubiIds: string[] | null,
  ): Promise<FruchwarnDto[]> {
    const warnings: FruchwarnDto[] = [];
    const where = azubiIds ? { azubiId: { in: azubiIds } } : {};

    const azubis = await this.prisma.user.findMany({
      where: { roles: { some: { role: Role.azubi } } },
      select: { id: true, firstName: true, lastName: true },
    });

    const gradeAgg = await this.prisma.grade.groupBy({
      by: ['azubiId'],
      where,
      _avg: { note: true },
    });
    for (const g of gradeAgg) {
      const avg = g._avg.note ?? 0;
      if (avg >= 4.5) {
        const azubi = azubis.find((a) => a.id === g.azubiId);
        warnings.push({
          azubiId: g.azubiId,
          name: azubi ? `${azubi.firstName} ${azubi.lastName}` : g.azubiId,
          type: 'note_fruehwarnung',
          details: `Durchschnitt ${avg} >= 4.5`,
        });
      }
    }

    const reports = await this.prisma.report.groupBy({
      by: ['azubiId'],
      where,
      _count: { _all: true },
    });
    for (const r of reports) {
      if (r._count._all >= 4) {
        const azubi = azubis.find((a) => a.id === r.azubiId);
        warnings.push({
          azubiId: r.azubiId,
          name: azubi ? `${azubi.firstName} ${azubi.lastName}` : r.azubiId,
          type: 'fehlende_berichte',
          details: `${r._count._all} Berichte im Status "entwurf"`,
        });
      }
    }

    return warnings;
  }

  private async scopedAzubiWhere(currentUser: CurrentUser) {
    if (currentUser.roles.includes(Role.azubi)) {
      return { azubiId: currentUser.azubiId ?? currentUser.id };
    }
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    if (visible === 'ALL') {
      return {};
    }
    return { azubiId: { in: [...visible] } };
  }
}