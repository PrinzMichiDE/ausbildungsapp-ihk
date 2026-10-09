import { Test, TestingModule } from '@nestjs/testing';
import { EinsatzplanungService } from './einsatzplanung.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';

describe('EinsatzplanungService', () => {
  let service: EinsatzplanungService;
  let prisma: any;
  let accessScopeService: any;
  let currentUser: any;

  const createMockPrisma = () => ({
    einsatz: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'einsatz-1' }),
      update: vi.fn().mockResolvedValue({ id: 'einsatz-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'einsatz-1' }),
      count: vi.fn().mockResolvedValue(0),
    },
    pruefung: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
    $transaction: vi.fn().mockImplementation(async (fn: any) => fn(prisma)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EinsatzplanungService,
        { provide: PrismaService, useFactory: () => createMockPrisma() },
        { provide: AccessScopeService, useValue: { getScopeFilter: vi.fn().mockReturnValue({}), getVisibleAzubiIds: vi.fn().mockResolvedValue([]) } },
      ],
    }).compile();

    service = module.get<EinsatzplanungService>(EinsatzplanungService);
    prisma = module.get(PrismaService);
    accessScopeService = module.get(AccessScopeService);
    currentUser = { id: 'user-1' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('sollte alle Einsätze zurückgeben', async () => {
      const mockEinsaetze = [
        { id: '1', bezeichnung: 'Einsatz 1', startdatum: '2024-01-01' },
        { id: '2', bezeichnung: 'Einsatz 2', startdatum: '2024-01-02' },
      ];
      (prisma.einsatz.findMany as any).mockResolvedValueOnce(mockEinsaetze);

      const result = await service.findAll({}, currentUser);

      expect(prisma.einsatz.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].bezeichnung).toBe('Einsatz 1');
    });

    it('sollte Einsätze mit Paginierung zurückgeben', async () => {
      const mockEinsaetze = [{ id: '1', bezeichnung: 'Paginierter Einsatz' }];
      (prisma.einsatz.findMany as any).mockResolvedValueOnce(mockEinsaetze);
      (prisma.einsatz.count as any).mockResolvedValueOnce(1);

      await service.findAll({ page: 1, limit: 10 }, currentUser);

      expect(prisma.einsatz.findMany).toHaveBeenCalled();
      expect(prisma.einsatz.count).toHaveBeenCalled();
    });

    it('sollte Einsätze nach Status filtern', async () => {
      (prisma.einsatz.findMany as any).mockResolvedValueOnce([]);

      await service.findAll({ status: 'geplant' });

      expect(prisma.einsatz.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Object) }),
      );
    });
  });

  describe('findOne', () => {
    it('sollte einen einzelnen Einsatz zurückgeben', async () => {
      const mockEinsatz = { id: '1', bezeichnung: 'Einziger Einsatz', startdatum: '2024-01-01' };
      (prisma.einsatz.findUnique as any).mockResolvedValueOnce(mockEinsatz);

      const result = await service.findOne('1');

      expect(prisma.einsatz.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockEinsatz);
    });

    it('sollte null zurückgeben wenn Einsatz nicht existiert', async () => {
      (prisma.einsatz.findUnique as any).mockResolvedValueOnce(null);

      const result = await service.findOne('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('sollte einen neuen Einsatz erstellen', async () => {
      const createDto = { bezeichnung: 'Neuer Einsatz', startdatum: '2024-01-01' };
      const mockEinsatz = { id: 'new-id', ...createDto };

      (prisma.einsatz.create as any).mockResolvedValueOnce(mockEinsatz);

      const result = await service.create(createDto as any);

      expect(prisma.einsatz.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
    });

    it('sollte Beziehung zu Prüfling erstellen', async () => {
      const createDto = { bezeichnung: 'Einsatz mit Prüfling', prueflingId: 'user-1' };
      (prisma.einsatz.create as any).mockResolvedValueOnce({ id: 'new-id', ...createDto });
      (prisma.pruefung.findUnique as any).mockResolvedValueOnce({ id: 'pruefung-1' });

      await service.create(createDto as any);

      expect(prisma.pruefung.findUnique).toHaveBeenCalledWith({
        where: { prueflingId: 'user-1' },
      });
    });
  });

  describe('update', () => {
    it('sollte einen Einsatz aktualisieren', async () => {
      const updateDto = { bezeichnung: 'Aktualisierter Einsatz' };
      const mockEinsatz = { id: '1', ...updateDto };

      (prisma.einsatz.update as any).mockResolvedValueOnce(mockEinsatz);

      const result = await service.update('1', updateDto as any);

      expect(prisma.einsatz.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result.bezeichnung).toBe('Aktualisierter Einsatz');
    });
  });

  describe('remove', () => {
    it('sollte einen Einsatz löschen', async () => {
      (prisma.einsatz.delete as any).mockResolvedValueOnce({ id: '1' });

      const result = await service.remove('1');

      expect(prisma.einsatz.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result.id).toBe('1');
    });
  });

  describe('getAvailableAzubis', () => {
    it('sollte verfügbare Azubis zurückgeben', async () => {
      (prisma.user.findMany as any).mockResolvedValueOnce([
        { id: '1', vorname: 'Max', nachname: 'Mustermann' },
      ]);

      const result = await service.getAvailableAzubis();

      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].vorname).toBe('Max');
    });
  });
});