import { Test, TestingModule } from '@nestjs/testing';
import { DataPrivacyService } from './data-privacy.service';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { AuditService } from '../audit/audit.service.js';

vi.mock('./sub-services/datenschutz-request.service', () => ({
  DatenschutzRequestService: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'request-1' }),
    update: vi.fn().mockResolvedValue({ id: 'request-1' }),
    remove: vi.fn().mockResolvedValue({ id: 'request-1' }),
  })),
}));

vi.mock('./sub-services/consent.service', () => ({
  ConsentService: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'consent-1' }),
    update: vi.fn().mockResolvedValue({ id: 'consent-1' }),
    remove: vi.fn().mockResolvedValue({ id: 'consent-1' }),
  })),
}));

vi.mock('./sub-services/legal-basis.service', () => ({
  LegalBasisService: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'legal-1' }),
    update: vi.fn().mockResolvedValue({ id: 'legal-1' }),
    remove: vi.fn().mockResolvedValue({ id: 'legal-1' }),
  })),
}));

vi.mock('./sub-services/dpia.service', () => ({
  DpiaService: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'dpia-1' }),
    update: vi.fn().mockResolvedValue({ id: 'dpia-1' }),
    remove: vi.fn().mockResolvedValue({ id: 'dpia-1' }),
  })),
}));

vi.mock('./sub-services/pers-dat.service', () => ({
  PersDatService: vi.fn().mockImplementation(() => ({
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'persdat-1' }),
    update: vi.fn().mockResolvedValue({ id: 'persdat-1' }),
    remove: vi.fn().mockResolvedValue({ id: 'persdat-1' }),
  })),
}));

describe('DataPrivacyService', () => {
  let service: DataPrivacyService;
  let prisma: any;
  let accessScopeService: any;
  let auditService: any;

  const createMockPrisma = () => ({
    datenschutzRequest: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'request-1' }),
      update: vi.fn().mockResolvedValue({ id: 'request-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'request-1' }),
    },
    consent: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'consent-1' }),
      update: vi.fn().mockResolvedValue({ id: 'consent-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'consent-1' }),
    },
    consentLog: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({ id: 'log-1' }),
    },
    legalBasis: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'legal-1' }),
      update: vi.fn().mockResolvedValue({ id: 'legal-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'legal-1' }),
    },
    dpiaEntry: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'dpia-1' }),
      update: vi.fn().mockResolvedValue({ id: 'dpia-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'dpia-1' }),
    },
    persDat: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'persdat-1' }),
      update: vi.fn().mockResolvedValue({ id: 'persdat-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'persdat-1' }),
    },
    auditEvent: {
      create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
    $transaction: vi.fn().mockImplementation(async (fn: any) => fn(prisma)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataPrivacyService,
        { provide: PrismaService, useFactory: () => createMockPrisma() },
        { provide: AccessScopeService, useValue: { getScopeFilter: vi.fn().mockReturnValue({}) } },
        { provide: AuditService, useValue: { log: vi.fn() } },
      ],
    }).compile();

    service = module.get<DataPrivacyService>(DataPrivacyService);
    prisma = module.get(PrismaService);
    accessScopeService = module.get(AccessScopeService);
    auditService = module.get(AuditService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('DatenschutzRequest - findAll', () => {
    it('sollte alle Datenschutz-Anfragen zurückgeben', async () => {
      const mockRequests = [
        { id: '1', typ: 'auskunft', status: 'offen' },
        { id: '2', typ: 'loeschung', status: 'in_bearbeitung' },
      ];
      (prisma.datenschutzRequest.findMany as any).mockResolvedValueOnce(mockRequests);

      const result = await service['datenschutzRequest'].findAll({});

      expect(prisma.datenschutzRequest.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('DatenschutzRequest - findOne', () => {
    it('sollte eine einzelne Datenschutz-Anfrage zurückgeben', async () => {
      const mockRequest = { id: '1', typ: 'auskunft', status: 'offen' };
      (prisma.datenschutzRequest.findUnique as any).mockResolvedValueOnce(mockRequest);

      const result = await service['datenschutzRequest'].findOne('1');

      expect(prisma.datenschutzRequest.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockRequest);
    });
  });

  describe('DatenschutzRequest - create', () => {
    it('sollte eine neue Datenschutz-Anfrage erstellen', async () => {
      const createDto = { typ: 'auskunft', beschreibung: 'Auskunft über Daten' };
      const mockRequest = { id: 'new-id', ...createDto };

      (prisma.datenschutzRequest.create as any).mockResolvedValueOnce(mockRequest);

      const result = await service['datenschutzRequest'].create(createDto as any);

      expect(prisma.datenschutzRequest.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
    });
  });

  describe('DatenschutzRequest - update', () => {
    it('sollte eine Datenschutz-Anfrage aktualisieren', async () => {
      const updateDto = { status: 'erledigt' };
      const mockRequest = { id: '1', ...updateDto };

      (prisma.datenschutzRequest.update as any).mockResolvedValueOnce(mockRequest);

      const result = await service['datenschutzRequest'].update('1', updateDto as any);

      expect(prisma.datenschutzRequest.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result.status).toBe('erledigt');
    });
  });

  describe('DatenschutzRequest - remove', () => {
    it('sollte eine Datenschutz-Anfrage löschen', async () => {
      (prisma.datenschutzRequest.delete as any).mockResolvedValueOnce({ id: '1' });

      const result = await service['datenschutzRequest'].remove('1');

      expect(prisma.datenschutzRequest.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result.id).toBe('1');
    });
  });

  describe('Consent - findAll', () => {
    it('sollte alle Einwilligungen zurückgeben', async () => {
      (prisma.consent.findMany as any).mockResolvedValueOnce([
        { id: '1', userId: 'user-1', typ: 'verarbeitung' },
      ]);

      const result = await service['consent'].findAll({});

      expect(prisma.consent.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('Consent - create', () => {
    it('sollte eine Einwilligung erstellen und loggen', async () => {
      const createDto = { userId: 'user-1', typ: 'verarbeitung', einwilligt: true };
      const mockConsent = { id: 'new-id', ...createDto };

      (prisma.consent.create as any).mockResolvedValueOnce(mockConsent);
      (prisma.consentLog.create as any).mockResolvedValueOnce({ id: 'log-1' });

      const result = await service['consent'].create(createDto as any);

      expect(prisma.consent.create).toHaveBeenCalled();
      expect(prisma.consentLog.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
    });
  });

  describe('LegalBasis - findAll', () => {
    it('sollte alle Rechtsgrundlagen zurückgeben', async () => {
      (prisma.legalBasis.findMany as any).mockResolvedValueOnce([
        { id: '1', bezeichnung: 'DSGVO Art. 6 Abs. 1 b' },
      ]);

      const result = await service['legalBasis'].findAll({});

      expect(prisma.legalBasis.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('Dpia - findAll', () => {
    it('sollte alle DPIA-Einträge zurückgeben', async () => {
      (prisma.dpiaEntry.findMany as any).mockResolvedValueOnce([
        { id: '1', titel: 'DPIA Verarbeitung' },
      ]);

      const result = await service['dpia'].findAll({});

      expect(prisma.dpiaEntry.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('Dpia - create', () => {
    it('sollte einen DPIA-Eintrag erstellen', async () => {
      const createDto = { titel: 'Neue DPIA', beschreibung: 'Daten Schutz Folgen abschaetzung' };
      const mockDpia = { id: 'new-id', ...createDto };

      (prisma.dpiaEntry.create as any).mockResolvedValueOnce(mockDpia);

      const result = await service['dpia'].create(createDto as any);

      expect(prisma.dpiaEntry.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
    });
  });

  describe('PersDat - findAll', () => {
    it('sollte alle personenbezogenen Daten zurückgeben', async () => {
      (prisma.persDat.findMany as any).mockResolvedValueOnce([
        { id: '1', benutzerId: 'user-1', feld: 'email' },
      ]);

      const result = await service['persDat'].findAll({});

      expect(prisma.persDat.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('PersDat - findOne', () => {
    it('sollte personenbezogene Daten eines Benutzers finden', async () => {
      const mockPersDat = { id: '1', benutzerId: 'user-1', feld: 'email', wert: 'test@example.com' };
      (prisma.persDat.findMany as any).mockResolvedValueOnce([mockPersDat]);

      const result = await service['persDat'].findOne('user-1');

      expect(prisma.persDat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ benutzerId: 'user-1' }) }),
      );
      expect(result).toContainEqual(mockPersDat);
    });
  });

  describe('PersDat - remove', () => {
    it('sollte personenbezogene Daten löschen', async () => {
      (prisma.persDat.delete as any).mockResolvedValueOnce({ id: '1' });

      const result = await service['persDat'].remove('persdat-1');

      expect(prisma.persDat.delete).toHaveBeenCalledWith({ where: { id: 'persdat-1' } });
      expect(result.id).toBe('1');
    });
  });
});