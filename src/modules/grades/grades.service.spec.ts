import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotenService } from './grades.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AuditService } from '../../modules/audit/audit.service.js';
import { NotificationsService } from '../../modules/notifications/notifications.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  grade: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    delete: vi.fn(),
    update: vi.fn(),
    groupBy: vi.fn(),
  },
  gradeVersion: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  $transaction: vi.fn(),
};

const mockAudit = { create: vi.fn() };
const mockNotifications = { create: vi.fn() };
const mockScope = {
  assertCanAccessAzubi: vi.fn(),
  getVisibleAzubiIds: vi.fn().mockResolvedValue('ALL'),
};

const makeUser = (roles: Role[] = [Role.ausbilder], azubiId?: string): CurrentUser => ({
  id: 'user-1',
  roles,
  azubiId: azubiId ?? 'azubi-1',
});

describe('NotenService', () => {
  let service: NotenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotenService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AccessScopeService, useValue: mockScope },
        { provide: AuditService, useValue: mockAudit },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();
    service = module.get(NotenService);
  });

  describe('create', () => {
    it('erstellt eine Note als Ausbilder', async () => {
      mockPrisma.grade.create.mockResolvedValue({
        id: 'grade-1', azubiId: 'azubi-1', fach: 'Mathe', note: 2.0,
        zeitraum: '2026/2027', status: 'entwurf', createdAt: new Date(), updatedAt: new Date(),
      });
      const result = await service.create(makeUser([Role.ausbilder]), {
        fach: 'Mathe', note: 2.0, zeitraum: '2026/2027',
      });
      expect(result.fach).toBe('Mathe');
      expect(mockPrisma.grade.create).toHaveBeenCalledOnce();
    });

    it('wirft ForbiddenException für Azubi', async () => {
      await expect(service.create(makeUser([Role.azubi]), {
        fach: 'Mathe', note: 2.0, zeitraum: '2026/2027',
      })).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findOne', () => {
    it('liefert eine Note', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({
        id: 'grade-1', azubiId: 'azubi-1', fach: 'Mathe', note: 2.0,
        zeitraum: '2026/2027', status: 'entwurf', createdAt: new Date(), updatedAt: new Date(),
      });
      const result = await service.findOne('grade-1', makeUser([Role.ausbilder]));
      expect(result.note).toBe(2.0);
    });

    it('wirft NotFoundException für unbekannte Note', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue(null);
      await expect(service.findOne('unknown', makeUser([Role.ausbilder]))).rejects.toThrow(NotFoundException);
    });
  });

  describe('Workflow (confirm/visieren/archivieren)', () => {
    beforeEach(() => {
      mockPrisma.gradeVersion.findMany.mockResolvedValue([]);
    });

    it('bestätigt eine Entwurf-Note', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({
        id: 'grade-1', azubiId: 'azubi-1', fach: 'Mathe', note: 2.0,
        zeitraum: '2026/2027', status: 'entwurf', createdAt: new Date(), updatedAt: new Date(),
      });
      mockPrisma.grade.update.mockResolvedValue({ id: 'grade-1', status: 'bestaetigt' });
      const result = await service.confirm('grade-1', makeUser([Role.ausbilder]));
      expect(result.status).toBe('bestaetigt');
    });

    it('wirft ForbiddenException wenn bereits visiert', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({ id: 'grade-1', status: 'visiert' });
      await expect(service.confirm('grade-1', makeUser([Role.ausbilder]))).rejects.toThrow(ForbiddenException);
    });

    it('visiert eine bestätigte Note', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({
        id: 'grade-1', azubiId: 'azubi-1', fach: 'Mathe', note: 2.0,
        zeitraum: '2026/2027', status: 'bestaetigt', createdAt: new Date(), updatedAt: new Date(),
      });
      mockPrisma.grade.update.mockResolvedValue({ id: 'grade-1', status: 'visiert' });
      const result = await service.visieren('grade-1', makeUser([Role.ausbilder]));
      expect(result.status).toBe('visiert');
    });

    it('archiviert eine visierte Note', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({
        id: 'grade-1', azubiId: 'azubi-1', fach: 'Mathe', note: 2.0,
        zeitraum: '2026/2027', status: 'visiert', createdAt: new Date(), updatedAt: new Date(),
      });
      mockPrisma.grade.update.mockResolvedValue({ id: 'grade-1', status: 'archiviert' });
      const result = await service.archivieren('grade-1', makeUser([Role.ausbilder]));
      expect(result.status).toBe('archiviert');
    });
  });

  describe('getWarnliste', () => {
    it('filtert Noten ab 3.0', async () => {
      mockPrisma.grade.findMany.mockResolvedValue([
        { id: 'g1', note: 5.0, fach: 'Mathe' },
        { id: 'g2', note: 4.0, fach: 'Physik' },
        { id: 'g3', note: 2.0, fach: 'Bio' },
      ]);
      const result = await service.getWarnliste(makeUser([Role.ausbilder]));
      expect(result.kritisch.length).toBe(1);
      expect(result.warnung.length).toBe(1);
      expect(result.gut.length).toBe(0);
      expect(result.gesamt).toBe(3);
    });
  });

  describe('getGPA', () => {
    it('berechnet gewichteten Durchschnitt', async () => {
      mockPrisma.grade.findMany.mockResolvedValue([
        { id: 'g1', fach: 'Mathe', note: 2.0, gewichtung: 2.0, halbjahr: 'erstes', azubiId: 'azubi-1', status: 'bestaetigt' },
        { id: 'g2', fach: 'Physik', note: 4.0, gewichtung: 1.0, halbjahr: 'zweites', azubiId: 'azubi-1', status: 'bestaetigt' },
      ]);
      const result = await service.getGPA('azubi-1', makeUser([Role.ausbilder]));
      expect(result.gesamt).toBeCloseTo(2.67, 1);
      expect(result.anzahlNoten).toBe(2);
    });

    it('liefert 0 bei keinen Noten', async () => {
      mockPrisma.grade.findMany.mockResolvedValue([]);
      const result = await service.getGPA('azubi-1', makeUser([Role.ausbilder]));
      expect(result.gesamt).toBe(0);
      expect(result.anzahlNoten).toBe(0);
    });
  });

  describe('remove', () => {
    it('löscht eine Note', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({ id: 'grade-1', status: 'entwurf' });
      mockPrisma.grade.delete.mockResolvedValue({});
      await service.remove('grade-1', makeUser([Role.ausbilder]));
      expect(mockPrisma.grade.delete).toHaveBeenCalledWith({ where: { id: 'grade-1' } });
    });
  });

  describe('exportCsv', () => {
    it('erzeugt CSV-String', async () => {
      mockPrisma.grade.findMany.mockResolvedValue([
        { id: 'g1', fach: 'Mathe', note: 2.0, zeitraum: '2026/2027', halbjahr: 'erstes', typ: 'note', gewichtung: 1.0, gewichtungsKategorie: null, status: 'bestaetigt', datum: new Date(), pruefungsart: null, wiederholung: false, maßnahme: null, zeugnisUrl: null, bewertung: null, bewertetAm: null, createdAt: new Date() },
      ]);
      const csv = await service.exportCsv(makeUser([Role.ausbilder]));
      expect(csv).toContain('Mathe');
      expect(csv).toContain('2');
      expect(csv.split('\n').length).toBe(2);
    });
  });

  describe('exportPdf', () => {
    it('erzeugt PDF-Buffer', async () => {
      mockPrisma.grade.findUnique.mockResolvedValue({
        id: 'grade-1', azubiId: 'azubi-1', fach: 'Mathe', note: 2.0, zeitraum: '2026/2027',
        halbjahr: 'erstes', datum: new Date(), pruefungsart: null, gewichtung: 1.0,
        gewichtungsKategorie: null, typ: 'note', status: 'bestaetigt', beschreibung: null,
        bemerkungen: null, prueferId: null, pruefungsdatum: null, wiederholung: false,
        maßnahme: null, zeugnisUrl: null, quellenUrl: null, kursId: null,
        bewertetVon: null, bewertetAm: null, bewertung: null, createdAt: new Date(), updatedAt: new Date(),
      });
      const buffer = await service.exportPdf(makeUser([Role.ausbilder]), 'grade-1');
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.toString('latin1').substring(0, 5)).toBe('%PDF-');
    });
  });
});
