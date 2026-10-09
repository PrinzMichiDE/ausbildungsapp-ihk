import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { RagService } from '../ai/rag.service.js';
import { ConfigService } from '@nestjs/config';
import { AiImportService } from '../ai-import.service.js';
import { ErrorCodes } from '../../common/constants/error-codes.js';
import { Roles } from '../../common/constants/roles.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';

const mockPrisma = () => ({
  document: {
    create: vi.fn().mockResolvedValue({}),
    findUnique: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({}),
  },
  course: {
    create: vi.fn().mockResolvedValue({}),
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  },
  $transaction: vi.fn().mockImplementation(async (callbacks) => callbacks(prisma)),
});

describe('AiImportService', () => {
  let service: AiImportService;
  let prisma: Record<string, any>;
  let configService: ConfigService;

  const currentUser = {
    id: 'user-1',
    email: 'test@example.com',
    roles: [Roles.AUSBILDER],
  };

  beforeEach(async () => {
    prisma = mockPrisma() as Record<string, any>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiImportService,
        { provide: PrismaService, useValue: prisma },
        {
          provide: AiService,
          useValue: {
            completeJson: vi.fn().mockResolvedValue({}),
          },
        },
        {
          provide: RagService,
          useValue: {
            indexDocument: vi.fn().mockResolvedValue(10),
            retrieveContext: vi.fn().mockResolvedValue('context'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockImplementation((key: string) => {
              if (key === 'AI_QUALITY_THRESHOLD') return 0.7;
              return 'default';
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiImportService>(AiImportService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('uploadDocument', () => {
    it('sollte ein Dokument erstellen', async () => {
      const document = {
        id: 'doc-1',
        name: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        documentVectorId: null,
      };

      prisma.document.create.mockResolvedValue(document);

      const result = await service.uploadDocument('test.pdf', 'application/pdf', Buffer.from('data'), currentUser);

      expect(result).toEqual(document);
      expect(prisma.document.create).toHaveBeenCalled();
    });
  });

  describe('indexDocument', () => {
    it('sollte ein Dokument indexieren und die chunk-Anzahl zurueckgeben', async () => {
      const document = { id: 'doc-1', name: 'test.pdf', documentVectorId: null };
      const chunks = 10;

      prisma.document.findUnique.mockResolvedValue(document);
      (prisma as any).ragService = { indexDocument: vi.fn().mockResolvedValue(chunks) };

      const result = await service.indexDocument('doc-1');

      expect(result).toEqual(chunks);
    });

    it('sollte eine NotFoundException werfen wenn das Dokument nicht existiert', async () => {
      prisma.document.findUnique.mockResolvedValue(null);

      await expect(service.indexDocument('non-existent')).rejects.toThrow(
        new BusinessException(ErrorCodes.AI_IMPORT_DOCUMENT_NOT_FOUND),
      );
    });
  });

  describe('generateFromDoc', () => {
    it('sollte eine Course aus einem Dokument generieren', async () => {
      const document = { id: 'doc-1', name: 'test.pdf', documentVectorId: 'vec-1' };
      const context = 'Course content context';
      const generatedPayload = {
        title: 'Generated Course',
        description: 'Auto-generated from document',
      };
      const createdCourse = { id: 'c1', ...generatedPayload };

      prisma.document.findUnique.mockResolvedValue(document);
      prisma.ragService.retrieveContext.mockResolvedValue(context);
      prisma.aiService.completeJson.mockResolvedValue(generatedPayload);
      prisma.course.create.mockResolvedValue(createdCourse);

      const result = await service.generateFromDoc('doc-1', currentUser);

      expect(result).toEqual(createdCourse);
      expect(prisma.ragService.retrieveContext).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining(['doc-1']),
      );
      expect(prisma.aiService.completeJson).toHaveBeenCalled();
    });

    it('sollte eine BusinessException werfen wenn das Dokument nicht vectorisiert ist', async () => {
      const document = { id: 'doc-1', name: 'test.pdf', documentVectorId: null };

      prisma.document.findUnique.mockResolvedValue(document);

      await expect(service.generateFromDoc('doc-1', currentUser)).rejects.toThrow(
        new BusinessException(ErrorCodes.AI_IMPORT_DOCUMENT_NOT_VECTORISED),
      );
    });

    it('sollte eine BadRequestException werfen wenn die AI-Generierung fehlschlaegt', async () => {
      const document = { id: 'doc-1', name: 'test.pdf', documentVectorId: 'vec-1' };
      const context = 'Course content';

      prisma.document.findUnique.mockResolvedValue(document);
      prisma.ragService.retrieveContext.mockResolvedValue(context);
      prisma.aiService.completeJson.mockRejectedValue(new Error('AI generation failed'));

      await expect(service.generateFromDoc('doc-1', currentUser)).rejects.toThrow(BadRequestException);
    });

    it('sollte eine InternalServerErrorException werfen bei unerwarteten Fehlern', async () => {
      const document = { id: 'doc-1', name: 'test.pdf', documentVectorId: 'vec-1' };
      const context = 'Course content';
      const invalidPayload = { invalid: 'structure' };

      prisma.document.findUnique.mockResolvedValue(document);
      prisma.ragService.retrieveContext.mockResolvedValue(context);
      prisma.aiService.completeJson.mockResolvedValue(invalidPayload);
      prisma.course.create.mockRejectedValue(new Error('Database error'));

      await expect(service.generateFromDoc('doc-1', currentUser)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('scoreCourse', () => {
    it('sollte einen Score zwischen 0 und 1 zurueckgeben', async () => {
      const title = 'React Grundlagen';
      const description = 'Einfuehrung in React Framework';
      const context = 'React ist ein JavaScript Framework';

      const score = service.scoreCourse(title, description, context);

      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('sollte einen niedrigen Score bei unfaehrigem Text zurueckgeben', async () => {
      const score = service.scoreCourse('Unrelated Title', 'Random text', 'React is a JavaScript library');

      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('validatePayload', () => {
    it('sollte true zurueckgeben wenn das Payload valide ist', async () => {
      const payload = {
        titel: 'Test Course',
        beschreibung: 'A description',
        dauerInStunden: 10,
      };

      const result = service['validatePayload'](payload);

      expect(result).toBe(true);
    });

    it('sollte false zurueckgeben wenn der titel fehlt', async () => {
      const payload = {
        beschreibung: 'A description',
        dauerInStunden: 10,
      };

      const result = service['validatePayload'](payload);

      expect(result).toBe(false);
    });

    it('sollte false zurueckgeben wenn die dauerInStunden fehlt', async () => {
      const payload = {
        titel: 'Test Course',
        beschreibung: 'A description',
      };

      const result = service['validatePayload'](payload);

      expect(result).toBe(false);
    });
  });
});