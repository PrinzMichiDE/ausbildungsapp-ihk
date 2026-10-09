import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from './exams.service.js';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { PruefungsStatus } from '@prisma/client';

describe('ExamsService', () => {
  let service: ExamsService;
  let prisma: any;
  let accessScopeService: any;

  const createMockPrisma = () => ({
    pruefung: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'pruefung-1' }),
      update: vi.fn().mockResolvedValue({ id: 'pruefung-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'pruefung-1' }),
      count: vi.fn().mockResolvedValue(0),
    },
    pruefungsMeilenstein: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'meilenstein-1' }),
      update: vi.fn().mockResolvedValue({ id: 'meilenstein-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'meilenstein-1' }),
      count: vi.fn().mockResolvedValue(0),
    },
    $queryRaw: vi.fn().mockResolvedValue([]),
    $transaction: vi.fn().mockImplementation(async (fn: any) => fn(prisma)),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamsService,
        { provide: PrismaService, useFactory: () => createMockPrisma() },
        { provide: AccessScopeService, useValue: { getScopeFilter: vi.fn().mockReturnValue({}) } },
      ],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
    prisma = module.get(PrismaService);
    accessScopeService = module.get(AccessScopeService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Pruefung - findAll', () => {
    it('sollte alle Prüfungen zurückgeben', async () => {
      const mockPruefungen = [
        { id: '1', titel: 'Zwischenprüfung', status: PruefungsStatus.GEPLANNT },
        { id: '2', titel: 'Abschlussprüfung', status: PruefungsStatus.GEPLANNT },
      ];
      (prisma.pruefung.findMany as any).mockResolvedValueOnce(mockPruefungen);

      const result = await service['pruefung'].findAll({});

      expect(prisma.pruefung.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].titel).toBe('Zwischenprüfung');
    });

    it('sollte Prüfungen nach Status filtern', async () => {
      (prisma.pruefung.findMany as any).mockResolvedValueOnce([]);

      await service['pruefung'].findAll({ status: PruefungsStatus.ABSTAND });

      expect(prisma.pruefung.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.any(Object) }),
      );
    });

    it('sollte Prüfungen mit Paginierung zurückgeben', async () => {
      (prisma.pruefung.findMany as any).mockResolvedValueOnce([]);
      (prisma.pruefung.count as any).mockResolvedValueOnce(0);

      await service['pruefung'].findAll({ page: 1, limit: 10 });

      expect(prisma.pruefung.findMany).toHaveBeenCalled();
      expect(prisma.pruefung.count).toHaveBeenCalled();
    });
  });

  describe('Pruefung - findOne', () => {
    it('sollte eine einzelne Prüfung zurückgeben', async () => {
      const mockPruefung = { id: '1', titel: 'Einzelne Prüfung', status: PruefungsStatus.GEPLANNT };
      (prisma.pruefung.findUnique as any).mockResolvedValueOnce(mockPruefung);

      const result = await service['pruefung'].findOne('1');

      expect(prisma.pruefung.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockPruefung);
    });

    it('sollte null zurückgeben wenn Prüfung nicht existiert', async () => {
      (prisma.pruefung.findUnique as any).mockResolvedValueOnce(null);

      const result = await service['pruefung'].findOne('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('Pruefung - create', () => {
    it('sollte eine neue Prüfung erstellen', async () => {
      const createDto = { titel: 'Neue Prüfung', status: PruefungsStatus.GEPLANNT };
      const mockPruefung = { id: 'new-id', ...createDto };

      (prisma.pruefung.create as any).mockResolvedValueOnce(mockPruefung);

      const result = await service['pruefung'].create(createDto as any);

      expect(prisma.pruefung.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
    });
  });

  describe('Pruefung - update', () => {
    it('sollte eine Prüfung aktualisieren', async () => {
      const updateDto = { titel: 'Aktualisierte Prüfung', status: PruefungsStatus.BEGLUTET };
      const mockPruefung = { id: '1', ...updateDto };

      (prisma.pruefung.update as any).mockResolvedValueOnce(mockPruefung);

      const result = await service['pruefung'].update('1', updateDto as any);

      expect(prisma.pruefung.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result.titel).toBe('Aktualisierte Prüfung');
    });
  });

  describe('Pruefung - remove', () => {
    it('sollte eine Prüfung löschen', async () => {
      (prisma.pruefung.delete as any).mockResolvedValueOnce({ id: '1' });

      const result = await service['pruefung'].remove('1');

      expect(prisma.pruefung.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result.id).toBe('1');
    });
  });

  describe('Meilenstein - findAll', () => {
    it('sollte alle Meilensteine einer Prüfung zurückgeben', async () => {
      const mockMeilensteine = [
        { id: '1', name: 'Zwischenstand', order: 1 },
        { id: '2', name: 'Endstand', order: 2 },
      ];
      (prisma.pruefungsMeilenstein.findMany as any).mockResolvedValueOnce(mockMeilensteine);

      const result = await service['meilenstein'].findAll('pruefung-1');

      expect(prisma.pruefungsMeilenstein.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ pruefungId: 'pruefung-1' }) }),
      );
      expect(result).toHaveLength(2);
    });
  });

  describe('Meilenstein - create', () => {
    it('sollte einen neuen Meilenstein erstellen', async () => {
      const createDto = { name: 'Neuer Meilenstein', order: 3 };
      const mockMeilenstein = { id: 'new-id', ...createDto, pruefungId: 'pruefung-1' };

      (prisma.pruefungsMeilenstein.create as any).mockResolvedValueOnce(mockMeilenstein);

      const result = await service['meilenstein'].create('pruefung-1', createDto as any);

      expect(prisma.pruefungsMeilenstein.create).toHaveBeenCalled();
      expect(result.id).toBe('new-id');
    });
  });

  describe('Meilenstein - update', () => {
    it('sollte einen Meilenstein aktualisieren', async () => {
      const updateDto = { name: 'Aktualisierter Meilenstein' };
      const mockMeilenstein = { id: '1', ...updateDto };

      (prisma.pruefungsMeilenstein.update as any).mockResolvedValueOnce(mockMeilenstein);

      const result = await service['meilenstein'].update('meilenstein-1', updateDto as any);

      expect(prisma.pruefungsMeilenstein.update).toHaveBeenCalledWith({
        where: { id: 'meilenstein-1' },
        data: updateDto,
      });
    });
  });

  describe('Meilenstein - remove', () => {
    it('sollte einen Meilenstein löschen', async () => {
      (prisma.pruefungsMeilenstein.delete as any).mockResolvedValueOnce({ id: '1' });

      const result = await service['meilenstein'].remove('meilenstein-1');

      expect(prisma.pruefungsMeilenstein.delete).toHaveBeenCalledWith({ where: { id: 'meilenstein-1' } });
      expect(result.id).toBe('1');
    });
  });
});