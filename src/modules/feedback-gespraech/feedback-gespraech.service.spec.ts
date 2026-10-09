import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { ForbiddenException } from '@nestjs/common';

import { FeedbackGespraechService } from './feedback-gespraech.service.js';
import { AccessScopeService } from 'src/common/rbac/access-scope.service.js';
import { Status } from './entities/feedback-gespraech.entity.js';
import { NutzerArt } from '@modules/users/entities/nutzer.entity.js';

describe('FeedbackGespraechService', () => {
  let service: FeedbackGespraechService;
  let prisma: PrismaService;
  let accessScopeService: AccessScopeService;

  const mockPrisma = {
    feedbackGespraech: {
      create: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  const mockAccessScopeService = {
    assertCanAccessAzubi: vi.fn(),
    getVisibleAzubiIds: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackGespraechService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AccessScopeService, useValue: mockAccessScopeService },
      ],
    }).compile();

    service = module.get<FeedbackGespraechService>(FeedbackGespraechService);
    prisma = module.get<PrismaService>(PrismaService);
    accessScopeService = module.get<AccessScopeService>(AccessScopeService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('erstellt ein Feedback-Gespräch für einen Azubi', async () => {
      const azubiId = 'azubi-1';
      const createDto = {
        azubiId,
        betrag: 100,
        notiz: 'Erstes Gespräch',
      };
      const user = { id: 'user-1', nutzerArt: NutzerArt.AUSBILDUNGSBEAUFTRAGTER };

      const mockGespraech = {
        id: 'gespraech-1',
        azubiId,
        betrag: 100,
        notiz: 'Erstes Gespräch',
        status: Status.GEPLANNT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.feedbackGespraech.create.mockResolvedValue(mockGespraech);
      mockAccessScopeService.assertCanAccessAzubi.mockResolvedValue(undefined);

      const result = await service.create(createDto, user);

      expect(mockAccessScopeService.assertCanAccessAzubi).toHaveBeenCalledWith(
        azubiId,
        user,
      );
      expect(mockPrisma.feedbackGespraech.create).toHaveBeenCalledWith({
        data: {
          azubiId,
          betrag: 100,
          notiz: 'Erstes Gespräch',
          status: Status.GEPLANNT,
        },
      });
      expect(result).toEqual(mockGespraech);
    });

    it('wirft ForbiddenException, wenn kein Zugriff auf den Azubi', async () => {
      const createDto = {
        azubiId: 'azubi-1',
        betrag: 100,
        notiz: 'Test',
      };
      const user = { id: 'user-1', nutzerArt: NutzerArt.AUSBILDUNGSBEOAUFTRAGTER };

      mockAccessScopeService.assertCanAccessAzubi.mockRejectedValue(
        new ForbiddenException('Kein Zugriff'),
      );

      await expect(service.create(createDto, user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    it('gibt alle Feedback-Gespräche zurück', async () => {
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };
      const mockGespraechen = [
        {
          id: 'gespraech-1',
          azubiId: 'azubi-1',
          betrag: 100,
          status: Status.GEPLANNT,
        },
      ];

      mockPrisma.feedbackGespraech.findMany.mockResolvedValue(mockGespraechen);

      const result = await service.findAll(user);

      expect(mockPrisma.feedbackGespraech.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockGespraechen);
    });

    it('filtert nach Status und abteilungIds', async () => {
      const user = { id: 'user-1', nutzerArt: NutzerArt.AUSBILDUNGSBEAUFTRAGTER };
      const abteilungIds = ['abteilung-1'];

      mockPrisma.feedbackGespraech.findMany.mockResolvedValue([]);

      await service.findAll(user, { status: Status.GEPLANNT, abteilungIds });

      expect(mockPrisma.feedbackGespraech.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: Status.GEPLANNT,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('gibt ein einzelnes Feedback-Gespräch zurück', async () => {
      const id = 'gespraech-1';
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };
      const mockGespraech = {
        id,
        azubiId: 'azubi-1',
        betrag: 100,
        status: Status.GEPLANNT,
      };

      mockPrisma.feedbackGespraech.findUnique.mockResolvedValue(mockGespraech);

      const result = await service.findOne(id, user);

      expect(mockPrisma.feedbackGespraech.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockGespraech);
    });
  });

  describe('update', () => {
    it('aktualisiert ein Feedback-Gespräch', async () => {
      const id = 'gespraech-1';
      const updateDto = { betrag: 200, notiz: 'Aktualisiert' };
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };
      const mockGespraech = {
        id,
        azubiId: 'azubi-1',
        betrag: 200,
        notiz: 'Aktualisiert',
        status: Status.GEPLANNT,
      };

      mockPrisma.feedbackGespraech.update.mockResolvedValue(mockGespraech);

      const result = await service.update(id, updateDto, user);

      expect(mockPrisma.feedbackGespraech.update).toHaveBeenCalledWith({
        where: { id },
        data: { betrag: 200, notiz: 'Aktualisiert' },
      });
      expect(result).toEqual(mockGespraech);
    });

    it('wirft NotFoundException, wenn das Gespräch nicht existiert', async () => {
      const id = 'nicht-existierend';
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };

      mockPrisma.feedbackGespraech.update.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.update(id, {}, user)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('löscht ein Feedback-Gespräch', async () => {
      const id = 'gespraech-1';
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };
      const mockGespraech = {
        id,
        azubiId: 'azubi-1',
        betrag: 100,
        status: Status.GEPLANNT,
      };

      mockPrisma.feedbackGespraech.delete.mockResolvedValue(mockGespraech);

      const result = await service.remove(id, user);

      expect(mockPrisma.feedbackGespraech.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockGespraech);
    });
  });

  describe('statusAendern', () => {
    it('ändert den Status eines Feedback-Gesprächs', async () => {
      const id = 'gespraech-1';
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };
      const mockGespraech = {
        id,
        azubiId: 'azubi-1',
        status: Status.abgeschlossen,
      };

      mockPrisma.feedbackGespraech.update.mockResolvedValue(mockGespraech);

      const result = await service.statusAendern(id, Status.abgeschlossen, user);

      expect(mockPrisma.feedbackGespraech.update).toHaveBeenCalledWith({
        where: { id },
        data: { status: Status.abgeschlossen },
      });
      expect(result.status).toBe(Status.abgeschlossen);
    });
  });

  describe('vereinbarungErstellen', () => {
    it('erstellt eine Vereinbarung für ein Feedback-Gespräch', async () => {
      const id = 'gespraech-1';
      const user = { id: 'user-1', nutzerArt: NutzerArt.ADMIN };
      const vereinbarungData = {
        vereinbarung: 'Zielvereinbarung 2024',
        vereinbarungDatum: new Date(),
      };
      const mockGespraech = {
        id,
        azubiId: 'azubi-1',
        vereinbarung: 'Zielvereinbarung 2024',
        vereinbarungDatum: new Date(),
      };

      mockPrisma.feedbackGespraech.update.mockResolvedValue(mockGespraech);

      const result = await service.vereinbarungErstellen(id, vereinbarungData, user);

      expect(mockPrisma.feedbackGespraech.update).toHaveBeenCalledWith({
        where: { id },
        data: {
          vereinbarung: 'Zielvereinbarung 2024',
          vereinbarungDatum: expect.any(Date),
        },
      });
      expect(result.vereinbarung).toBe('Zielvereinbarung 2024');
    });
  });
});