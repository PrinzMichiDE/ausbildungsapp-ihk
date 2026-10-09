import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../../users/notifications.service.js';
import { ReportStatus, ReportTyp } from '../../common/constants/reports.js';

vi.mock('../../common/utils/build-simple-pdf', () => ({
  buildSimplePdf: vi.fn().mockResolvedValue({ pdfBuffer: Buffer.from('mock') }),
}));

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: any;
  let accessScopeService: any;
  let auditService: any;
  let notificationsService: any;

  const createMockPrisma = () => ({
    report: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'report-1', ...jest.requireActual('../../common/constants/reports') }),
      update: vi.fn().mockResolvedValue({ id: 'report-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'report-1' }),
    },
    zertifikat: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
    $transaction: vi.fn().mockImplementation(async (fn: any) => fn(prisma)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useFactory: () => createMockPrisma() },
        { provide: AccessScopeService, useValue: { getScopeFilter: vi.fn().mockReturnValue({}) } },
        { provide: AuditService, useValue: { log: vi.fn() } },
        { provide: NotificationsService, useValue: { send: vi.fn() } },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get(PrismaService);
    accessScopeService = module.get(AccessScopeService);
    auditService = module.get(AuditService);
    notificationsService = module.get(NotificationsService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('sollte alle Berichte für den aktuellen Benutzer zurückgeben', async () => {
      (prisma.report.findMany as any).mockResolvedValueOnce([
        { id: '1', titel: 'Test Bericht', status: ReportStatus.IN_BEARBEITUNG },
      ]);

      const result = await service.findAll({});

      expect(prisma.report.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].titel).toBe('Test Bericht');
    });

    it('sollte Berichte nach Status filtern', async () => {
      (prisma.report.findMany as any).mockResolvedValueOnce([
        { id: '1', titel: 'Abgeschlossener Bericht', status: ReportStatus.ABGESCHLOSSEN },
      ]);

      const result = await service.findAll({ status: ReportStatus.ABGESCHLOSSEN });

      expect(prisma.report.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ status: ReportStatus.ABGESCHLOSSEN }) }),
      );
    });
  });

  describe('findOne', () => {
    it('sollte einen einzelnen Bericht zurückgeben', async () => {
      const mockReport = { id: '1', titel: 'Einzelner Bericht' };
      (prisma.report.findUnique as any).mockResolvedValueOnce(mockReport);

      const result = await service.findOne('1');

      expect(prisma.report.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockReport);
    });

    it('sollte null zurückgeben wenn Bericht nicht existiert', async () => {
      (prisma.report.findUnique as any).mockResolvedValueOnce(null);

      const result = await service.findOne('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('sollte einen neuen Bericht erstellen', async () => {
      const createDto = { titel: 'Neuer Bericht', typ: ReportTyp.PROGRESS };
      const mockReport = { id: 'new-id', ...createDto, status: ReportStatus.IN_BEARBEITUNG };

      (prisma.report.create as any).mockResolvedValueOnce(mockReport);

      const result = await service.create(createDto as any);

      expect(prisma.report.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
      expect(result.status).toBe(ReportStatus.IN_BEARBEITUNG);
    });
  });

  describe('update', () => {
    it('sollte einen Bericht aktualisieren', async () => {
      const updateDto = { titel: 'Aktualisierter Bericht', status: ReportStatus.ABGESCHLOSSEN };
      const mockReport = { id: '1', ...updateDto };

      (prisma.report.update as any).mockResolvedValueOnce(mockReport);

      const result = await service.update('1', updateDto as any);

      expect(prisma.report.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result.titel).toBe('Aktualisierter Bericht');
    });
  });

  describe('remove', () => {
    it('sollte einen Bericht löschen', async () => {
      (prisma.report.delete as any).mockResolvedValueOnce({ id: '1' });

      const result = await service.remove('1');

      expect(prisma.report.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result.id).toBe('1');
    });
  });

  describe('azubiDashboard', () => {
    it('sollte Azubi-Dashboard mit eingesetzten Aufgaben zurückgeben', async () => {
      (prisma.report.findMany as any).mockResolvedValueOnce([
        { id: '1', titel: 'Azubi Report', status: ReportStatus.IN_BEARBEITUNG },
      ]);
      (prisma.zertifikat.findMany as any).mockResolvedValueOnce([
        { id: 'z1', titel: 'Zertifikat 1' },
      ]);

      const result = await service['azubiDashboard']({ id: 'user-1' } as any);

      expect(prisma.report.findMany).toHaveBeenCalled();
      expect(prisma.zertifikat.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('ausbildungsbeauftragterDashboard', () => {
    it('sollte Dashboard mit Team-Statistiken zurückgeben', async () => {
      (prisma.report.findMany as any).mockResolvedValueOnce([
        { id: '1', status: ReportStatus.IN_BEARBEITUNG },
        { id: '2', status: ReportStatus.ABGESCHLOSSEN },
      ]);

      const result = await service['ausbildungsbeauftragterDashboard']({ id: 'user-1' } as any);

      expect(prisma.report.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('managementDashboard', () => {
    it('sollte Management-Dashboard mit Gesamtstatistiken zurückgeben', async () => {
      (prisma.report.findMany as any).mockResolvedValueOnce([
        { id: '1', status: ReportStatus.IN_BEARBEITUNG },
        { id: '2', status: ReportStatus.ABGESCHLOSSEN },
        { id: '3', status: ReportStatus.ABGELEHNT },
      ]);
      (prisma.zertifikat.findMany as any).mockResolvedValueOnce([
        { id: 'z1', titel: 'Zertifikat' },
      ]);

      const result = await service['managementDashboard']({ id: 'user-1' } as any);

      expect(prisma.report.findMany).toHaveBeenCalled();
      expect(prisma.zertifikat.findMany).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getDashboard', () => {
    it('sollte azubiDashboard für azubi-Rolle aufrufen', async () => {
      const spy = vi.spyOn(service as any, 'azubiDashboard').mockResolvedValueOnce({ type: 'azubi' });

      const result = await service.getDashboard({ role: 'azubi' } as any);

      expect(spy).toHaveBeenCalledWith({ id: 'user-1' });
      expect(result.type).toBe('azubi');
    });

    it('sollte ausbildungsbeauftragterDashboard für ausbildungsbeauftragter-Rolle aufrufen', async () => {
      const spy = vi.spyOn(service as any, 'ausbildungsbeauftragterDashboard').mockResolvedValueOnce({ type: 'ausbildungsbeauftragter' });

      const result = await service.getDashboard({ role: 'ausbildungsbeauftragter' } as any);

      expect(spy).toHaveBeenCalled();
      expect(result.type).toBe('ausbildungsbeauftragter');
    });

    it('sollte managementDashboard für andere Rollen aufrufen', async () => {
      const spy = vi.spyOn(service as any, 'managementDashboard').mockResolvedValueOnce({ type: 'management' });

      const result = await service.getDashboard({ role: 'hr' } as any);

      expect(spy).toHaveBeenCalled();
      expect(result.type).toBe('management');
    });
  });
});