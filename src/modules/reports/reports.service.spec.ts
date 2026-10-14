import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenException } from '@nestjs/common';
import { ReportDayArt, ReportStatus, ReportTyp } from '@prisma/client';
import { BerichteService } from './reports.service.js';
import { Role } from '../../common/constants/roles.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import type { CurrentUser } from '../../common/decorators/current-user.type.js';

const AZUBI_ID = '00000000-0000-4000-8000-000000000001';
const REPORT_ID = '00000000-0000-4000-8000-0000000000aa';
const TASK_ID = '00000000-0000-4000-8000-0000000000bb';

const azubi = {
  id: AZUBI_ID,
  email: 'azubi@test.local',
  roles: [Role.azubi],
  abteilungIds: [],
  azubiId: AZUBI_ID,
} as unknown as CurrentUser;

const day = (datum: string, art: ReportDayArt = ReportDayArt.betrieb, minuten: number[] = []) => ({
  id: `day-${datum}`,
  datum: new Date(`${datum}T00:00:00Z`),
  art,
  aktivitaeten: minuten.map((dauerMinuten, i) => ({
    id: `act-${datum}-${i}`,
    beschreibung: 'Arbeit',
    dauerMinuten,
    sortierung: i,
    taskId: null,
    task: null,
  })),
});

const report = (overrides: Record<string, unknown> = {}) => ({
  id: REPORT_ID,
  azubiId: AZUBI_ID,
  titel: 'KW 42',
  typ: ReportTyp.betrieb,
  kalenderwoche: 42,
  jahr: 2026,
  datumVon: new Date('2026-10-12T00:00:00Z'),
  datumBis: new Date('2026-10-18T00:00:00Z'),
  inhaltMarkdown: '',
  status: ReportStatus.entwurf,
  signiertVon: null,
  signiertAm: null,
  archiviertAm: null,
  createdAt: new Date(),
  reportTasks: [],
  tage: [],
  ...overrides,
});

describe('BerichteService', () => {
  let service: BerichteService;
  let prisma: any;
  let audit: { create: ReturnType<typeof vi.fn> };
  let geburtsdatum: Date | null;
  let setReport: (r: ReturnType<typeof report>) => void;

  beforeEach(() => {
    geburtsdatum = null;
    let current = report();
    setReport = (r) => {
      current = r;
    };
    prisma = {
      report: {
        findUnique: vi.fn().mockImplementation(() => Promise.resolve(current)),
        create: vi.fn().mockImplementation(({ data }) => {
          current = report({ tage: data.tage.create.map((t: any) => day(t.datum.toISOString().slice(0, 10), t.art)) });
          return Promise.resolve(current);
        }),
        update: vi.fn().mockImplementation(({ data }) => {
          const { reportTasks: _ignored, ...scalars } = data;
          current = { ...current, ...scalars };
          return Promise.resolve(current);
        }),
      },
      reportDay: { deleteMany: vi.fn(), create: vi.fn() },
      reportVersion: { count: vi.fn().mockResolvedValue(0), create: vi.fn() },
      abwesenheit: { findMany: vi.fn().mockResolvedValue([]) },
      user: {
        findUnique: vi.fn().mockImplementation(() => Promise.resolve({ geburtsdatum })),
        findMany: vi.fn().mockResolvedValue([]),
      },
      task: {
        count: vi.fn().mockResolvedValue(1),
        findMany: vi.fn().mockResolvedValue([{ id: TASK_ID, titel: 'VLAN einrichten' }]),
      },
    };
    prisma.$transaction = vi.fn().mockImplementation((fn: (tx: unknown) => unknown) => fn(prisma));
    audit = { create: vi.fn() };
    const config = { get: vi.fn().mockReturnValue({ maxMinutesPerDay: 600, maxMinutesPerDayMinor: 480, maxMinutesPerWeekMinor: 2400 }) };

    service = new BerichteService(
      prisma,
      { assertCanAccessBericht: vi.fn(), getVisibleAzubiIds: vi.fn() } as any,
      { create: vi.fn() } as any,
      audit as any,
      config as any,
    );
  });

  describe('create', () => {
    it('derives the week dates and creates Monday to Friday', async () => {
      prisma.report.findUnique.mockResolvedValueOnce(null);

      const result = await service.create(azubi, { titel: 'KW 42', kalenderwoche: 42, jahr: 2026 });

      const data = prisma.report.create.mock.calls[0][0].data;
      expect(data.datumVon.toISOString().slice(0, 10)).toBe('2026-10-12');
      expect(data.datumBis.toISOString().slice(0, 10)).toBe('2026-10-18');
      expect(data.tage.create.map((t: any) => t.datum.toISOString().slice(0, 10))).toEqual([
        '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16',
      ]);
      expect(result.tage).toHaveLength(5);
      expect(audit.create).toHaveBeenCalledWith(azubi, expect.objectContaining({ action: 'REPORT_CREATED' }));
    });

    it('prefills day types from absences overlapping the week', async () => {
      prisma.report.findUnique.mockResolvedValueOnce(null);
      prisma.abwesenheit.findMany.mockResolvedValueOnce([
        { typ: 'urlaub', von: new Date('2026-10-13T00:00:00Z'), bis: new Date('2026-10-14T00:00:00Z') },
        { typ: 'berufsschule', von: new Date('2026-10-16T00:00:00Z'), bis: new Date('2026-10-16T00:00:00Z') },
      ]);

      await service.create(azubi, { titel: 'KW 42', kalenderwoche: 42, jahr: 2026 });

      const arten = prisma.report.create.mock.calls[0][0].data.tage.create.map((t: any) => t.art);
      expect(arten).toEqual(['betrieb', 'urlaub', 'urlaub', 'betrieb', 'berufsschule']);
    });

    it('rejects a second report for the same week', async () => {
      prisma.report.findUnique.mockResolvedValueOnce({ id: REPORT_ID });

      await expect(
        service.create(azubi, { titel: 'KW 42', kalenderwoche: 42, jahr: 2026 }),
      ).rejects.toMatchObject({ errorCode: 'REPORT_WEEK_EXISTS' });
      expect(prisma.report.create).not.toHaveBeenCalled();
    });

    it('rejects week 53 in a year with 52 weeks', async () => {
      await expect(
        service.create(azubi, { titel: 'KW 53', kalenderwoche: 53, jahr: 2025 }),
      ).rejects.toBeInstanceOf(BusinessException);
    });

    it('only allows azubis', async () => {
      await expect(
        service.create({ ...azubi, roles: [Role.ausbilder], azubiId: null } as any, { titel: 'x', kalenderwoche: 1, jahr: 2026 }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('saveDays', () => {
    beforeEach(() => {
      setReport(report());
    });

    it('replaces days in a transaction and derives markdown and task links', async () => {
      await service.saveDays(REPORT_ID, azubi, {
        tage: [{
          datum: '2026-10-12',
          art: ReportDayArt.betrieb,
          aktivitaeten: [{ beschreibung: ' Switch konfiguriert ', dauerMinuten: 150, taskId: TASK_ID }],
        }],
      });

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.reportDay.deleteMany).toHaveBeenCalledWith({ where: { reportId: REPORT_ID } });
      const created = prisma.reportDay.create.mock.calls[0][0].data;
      expect(created.aktivitaeten.create[0]).toMatchObject({ beschreibung: 'Switch konfiguriert', dauerMinuten: 150, taskId: TASK_ID });

      const updateData = prisma.report.update.mock.calls[0][0].data;
      expect(updateData.inhaltMarkdown).toContain('- 02:30 Switch konfiguriert [Task: VLAN einrichten]');
      expect(updateData.reportTasks.create).toEqual([{ taskId: TASK_ID }]);
    });

    it('rejects whitespace-only descriptions', async () => {
      await expect(
        service.saveDays(REPORT_ID, azubi, {
          tage: [{ datum: '2026-10-12', art: ReportDayArt.betrieb, aktivitaeten: [{ beschreibung: '   ', dauerMinuten: 60 }] }],
        }),
      ).rejects.toMatchObject({ errorCode: 'VALIDATION_FAILED' });
    });

    it('blocks a day over 10:00 for adults', async () => {
      await expect(
        service.saveDays(REPORT_ID, azubi, {
          tage: [{ datum: '2026-10-12', art: ReportDayArt.betrieb, aktivitaeten: [
            { beschreibung: 'a', dauerMinuten: 600 },
            { beschreibung: 'b', dauerMinuten: 5 },
          ] }],
        }),
      ).rejects.toMatchObject({ errorCode: 'REPORT_DAY_LIMIT_EXCEEDED' });
      expect(prisma.reportDay.deleteMany).not.toHaveBeenCalled();
    });

    it('blocks a day over 8:00 for minors', async () => {
      geburtsdatum = new Date('2010-05-01T00:00:00Z');
      await expect(
        service.saveDays(REPORT_ID, azubi, {
          tage: [{ datum: '2026-10-12', art: ReportDayArt.betrieb, aktivitaeten: [{ beschreibung: 'a', dauerMinuten: 485 }] }],
        }),
      ).rejects.toMatchObject({ errorCode: 'REPORT_DAY_LIMIT_EXCEEDED' });
    });

    it('rejects unreleased tasks', async () => {
      prisma.task.count.mockResolvedValueOnce(0);
      await expect(
        service.saveDays(REPORT_ID, azubi, {
          tage: [{ datum: '2026-10-12', art: ReportDayArt.betrieb, aktivitaeten: [{ beschreibung: 'a', dauerMinuten: 60, taskId: TASK_ID }] }],
        }),
      ).rejects.toMatchObject({ errorCode: 'TASK_NOT_FOUND' });
    });

    it('is only allowed in status entwurf', async () => {
      setReport(report({ status: ReportStatus.eingereicht }));
      await expect(service.saveDays(REPORT_ID, azubi, { tage: [] })).rejects.toMatchObject({
        errorCode: 'REPORT_NOT_EDITABLE',
      });
    });

    it('rejects editing someone else\'s report', async () => {
      setReport(report({ azubiId: 'other' }));
      await expect(service.saveDays(REPORT_ID, azubi, { tage: [] })).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('submit', () => {
    it('rejects incomplete weeks with the missing days', async () => {
      setReport(report({
        tage: [day('2026-10-12', ReportDayArt.betrieb, [480]), day('2026-10-13', ReportDayArt.urlaub)],
      }));

      const error = await service.submit(REPORT_ID, azubi).catch((e) => e);

      expect(error).toMatchObject({ errorCode: 'REPORT_INCOMPLETE' });
      expect(error.details[0].fehlendeTage).toEqual(['2026-10-14', '2026-10-15', '2026-10-16']);
      expect(prisma.report.update).not.toHaveBeenCalled();
    });

    it('submits a complete week and stores a version', async () => {
      setReport(report({
        tage: [
          day('2026-10-12', ReportDayArt.betrieb, [480]),
          day('2026-10-13', ReportDayArt.urlaub),
          day('2026-10-14', ReportDayArt.berufsschule, [360]),
          day('2026-10-15', ReportDayArt.krank),
          day('2026-10-16', ReportDayArt.betrieb, [420]),
        ],
      }));

      const result = await service.submit(REPORT_ID, azubi);

      expect(prisma.report.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: ReportStatus.eingereicht } }));
      expect(prisma.reportVersion.create).toHaveBeenCalled();
      expect(result.summeMinuten).toBe(1260);
    });
  });

  describe('findOne', () => {
    it('returns days with sums and the per-day limit', async () => {
      geburtsdatum = new Date('2008-10-14T00:00:00Z');
      setReport(report({
        tage: [day('2026-10-13', ReportDayArt.betrieb, [120, 60]), day('2026-10-14', ReportDayArt.betrieb, [60])],
      }));

      const result = await service.findOne(REPORT_ID, azubi);

      expect(result.tage?.map((t) => [t.datum, t.summeMinuten, t.maxMinuten])).toEqual([
        ['2026-10-13', 180, 480],
        ['2026-10-14', 60, 600],
      ]);
      expect(result.summeMinuten).toBe(240);
      expect(result.maxMinutenWoche).toBe(2400);
    });
  });
});
