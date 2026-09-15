import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { BerichteService } from './reports.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { AuditService } from '../audit/audit.service.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { ReportStatus } from '@prisma/client';
import { Role } from '../../common/constants/roles.js';

describe('BerichteService', () => {
  let service: BerichteService;
  let prisma: {
    report: {
      create: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
    };
    reportVersion: {
      create: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
    };
    reportTask: { deleteMany: ReturnType<typeof vi.fn> };
    reportAttachment: {
      create: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
    };
    reportTimeEntry: {
      create: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
    };
    reportComment: { create: ReturnType<typeof vi.fn>; findMany: ReturnType<typeof vi.fn> };
    user: { findMany: ReturnType<typeof vi.fn> };
    task: { count: ReturnType<typeof vi.fn> };
    $transaction: ReturnType<typeof vi.fn>;
  };
  let scope: {
    getVisibleAzubiIds: ReturnType<typeof vi.fn>;
    assertCanAccessAzubi: ReturnType<typeof vi.fn>;
    assertCanAccessBericht: ReturnType<typeof vi.fn>;
  };
  let notifications: { create: ReturnType<typeof vi.fn> };
  let audit: { create: ReturnType<typeof vi.fn> };

  const mockAzubiUser = {
    id: 'user-1',
    email: 'azubi@test.de',
    firstName: 'Max',
    lastName: 'Mustermann',
    roles: [Role.azubi],
    azubiId: 'azubi-1',
  };

  const mockReviewerUser = {
    id: 'user-2',
    email: 'reviewer@test.de',
    firstName: 'Anna',
    lastName: 'Schmidt',
    roles: [Role.ausbildungsbeauftragter],
    azubiId: null,
  };

  const mockReport = {
    id: 'report-1',
    azubiId: 'azubi-1',
    titel: 'Test-Bericht',
    typ: 'betrieb' as const,
    kalenderwoche: 12,
    jahr: 2026,
    datumVon: new Date('2026-03-16'),
    datumBis: new Date('2026-03-20'),
    inhaltMarkdown: 'Inhalt',
    status: ReportStatus.entwurf,
    signiertVon: null,
    signiertAm: null,
    archiviertAm: null,
    reportTasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      report: {
        create: vi.fn().mockResolvedValue(mockReport),
        findUnique: vi.fn().mockResolvedValue(mockReport),
        findMany: vi.fn().mockResolvedValue([mockReport]),
        update: vi.fn().mockResolvedValue({ ...mockReport, status: ReportStatus.eingereicht }),
        delete: vi.fn().mockResolvedValue(undefined),
        count: vi.fn().mockResolvedValue(0),
      },
      reportVersion: {
        create: vi.fn().mockResolvedValue({}),
        count: vi.fn().mockResolvedValue(0),
        findMany: vi.fn().mockResolvedValue([]),
        findFirst: vi.fn().mockResolvedValue(null),
      },
      reportTask: { deleteMany: vi.fn().mockResolvedValue(undefined) },
      reportAttachment: {
        create: vi.fn().mockResolvedValue({}),
        findMany: vi.fn().mockResolvedValue([]),
      },
      reportTimeEntry: {
        create: vi.fn().mockResolvedValue({}),
        findMany: vi.fn().mockResolvedValue([]),
      },
      reportComment: {
        create: vi.fn().mockResolvedValue({}),
        findMany: vi.fn().mockResolvedValue([]),
      },
      user: { findMany: vi.fn().mockResolvedValue([]) },
      task: { count: vi.fn().mockResolvedValue(0) },
      $transaction: vi.fn().mockImplementation((fns: Promise<unknown>[]) => Promise.all(fns)),
    };

    scope = {
      getVisibleAzubiIds: vi.fn().mockResolvedValue('ALL'),
      assertCanAccessAzubi: vi.fn().mockResolvedValue(undefined),
      assertCanAccessBericht: vi.fn().mockResolvedValue(undefined),
    };

    notifications = { create: vi.fn().mockResolvedValue(undefined) };
    audit = { create: vi.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BerichteService,
        { provide: PrismaService, useValue: prisma },
        { provide: AccessScopeService, useValue: scope },
        { provide: NotificationsService, useValue: notifications },
        { provide: AuditService, useValue: audit },
      ],
    }).compile();

    service = module.get(BerichteService);
  });

  describe('create', () => {
    it('erstellt einen Bericht mit Status entwurf', async () => {
      const result = await service.create(mockAzubiUser, {
        titel: 'Test',
        typ: 'betrieb',
        kalenderwoche: 12,
        jahr: 2026,
        datumVon: '2026-03-16',
        datumBis: '2026-03-20',
        inhaltMarkdown: 'Test',
      });

      expect(result.status).toBe(ReportStatus.entwurf);
      expect(prisma.report.create).toHaveBeenCalled();
      expect(audit.create).toHaveBeenCalledWith(
        mockAzubiUser,
        expect.objectContaining({ action: 'REPORT_CREATED' }),
      );
    });

    it('wirft ForbiddenException für Nicht-Azubis', async () => {
      await expect(
        service.create(mockReviewerUser, {
          titel: 'Test',
          typ: 'betrieb',
          kalenderwoche: 12,
          jahr: 2026,
          datumVon: '2026-03-16',
          datumBis: '2026-03-20',
          inhaltMarkdown: 'Test',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('wirft Fehler wenn datumVon >= datumBis', async () => {
      await expect(
        service.create(mockAzubiUser, {
          titel: 'Test',
          typ: 'betrieb',
          kalenderwoche: 12,
          jahr: 2026,
          datumVon: '2026-03-20',
          datumBis: '2026-03-16',
          inhaltMarkdown: 'Test',
        }),
      ).rejects.toThrow(BusinessException);
    });
  });

  describe('submit', () => {
    it('setzt Status auf eingereicht', async () => {
      prisma.report.update.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.eingereicht,
      });

      const result = await service.submit('report-1', mockAzubiUser);

      expect(result.status).toBe(ReportStatus.eingereicht);
      expect(prisma.reportVersion.create).toHaveBeenCalled();
      expect(audit.create).toHaveBeenCalledWith(
        mockAzubiUser,
        expect.objectContaining({ action: 'REPORT_SUBMITTED' }),
      );
    });

    it('wirft Fehler wenn nicht entwurf', async () => {
      prisma.report.findUnique.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.eingereicht,
      });

      await expect(service.submit('report-1', mockAzubiUser)).rejects.toThrow(
        BusinessException,
      );
    });
  });

  describe('cancel', () => {
    it('setzt Status zurück auf entwurf', async () => {
      prisma.report.findUnique.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.eingereicht,
      });
      prisma.report.update.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.entwurf,
      });

      const result = await service.cancel('report-1', mockAzubiUser);

      expect(result.status).toBe(ReportStatus.entwurf);
      expect(notifications.create).toHaveBeenCalled();
      expect(audit.create).toHaveBeenCalledWith(
        mockAzubiUser,
        expect.objectContaining({ action: 'REPORT_CANCELLED' }),
      );
    });

    it('wirft Fehler wenn nicht eingereicht', async () => {
      prisma.report.findUnique.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.entwurf,
      });

      await expect(service.cancel('report-1', mockAzubiUser)).rejects.toThrow(
        BusinessException,
      );
    });
  });

  describe('remove', () => {
    it('löscht einen entwurf-Bericht', async () => {
      await service.remove('report-1', mockAzubiUser);

      expect(prisma.report.delete).toHaveBeenCalledWith({ where: { id: 'report-1' } });
      expect(audit.create).toHaveBeenCalledWith(
        mockAzubiUser,
        expect.objectContaining({ action: 'REPORT_DELETED' }),
      );
    });
  });

  describe('addAttachment', () => {
    it('erstellt einen Anhang', async () => {
      await service.addAttachment('report-1', mockAzubiUser, {
        typ: 'screenshot',
        dateiUrl: 'https://example.com/file.png',
      });

      expect(prisma.reportAttachment.create).toHaveBeenCalled();
    });
  });

  describe('addTimeEntry', () => {
    it('erstellt einen Zeiteintrag', async () => {
      await service.addTimeEntry('report-1', mockAzubiUser, {
        stunden: 2.5,
        kommentar: 'Test',
      });

      expect(prisma.reportTimeEntry.create).toHaveBeenCalled();
    });
  });

  describe('getVersions', () => {
    it('liefert Versionen chronologisch', async () => {
      await service.getVersions('report-1', mockAzubiUser);

      expect(prisma.reportVersion.findMany).toHaveBeenCalledWith({
        where: { reportId: 'report-1' },
        orderBy: { version: 'asc' },
      });
    });
  });

  describe('getDiff', () => {
    it('liefert Inhalte zweier Versionen', async () => {
      prisma.reportVersion.findFirst
        .mockResolvedValueOnce({ inhaltMarkdown: 'V1' })
        .mockResolvedValueOnce({ inhaltMarkdown: 'V2' });

      const result = await service.getDiff('report-1', mockAzubiUser, 1, 2);

      expect(result.v1).toBe('V1');
      expect(result.v2).toBe('V2');
    });
  });

  describe('review', () => {
    it('wirft Fehler für Nicht-Ausbildungsbeauftragte', async () => {
      await expect(
        service.review('report-1', mockAzubiUser, { entscheidung: 'freigeben' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('wirft Fehler wenn nicht eingereicht', async () => {
      prisma.report.findUnique.mockResolvedValue({
        ...mockReport,
        status: ReportStatus.entwurf,
      });

      await expect(
        service.review('report-1', mockReviewerUser, { entscheidung: 'freigeben' }),
      ).rejects.toThrow(BusinessException);
    });
  });
});
