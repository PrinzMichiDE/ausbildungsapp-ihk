import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AiService } from '../ai/ai.service';
import { RagService } from '../ai/rag.service';
import { ConfigService } from '@nestjs/config';
import { FrameworksService } from './frameworks.service';
import { CreateFrameworkDto, UpdateFrameworkDto } from './dto/learning-content.dto';
import { ErrorCodes } from '../../common/constants/error-codes';
import { BusinessException } from '../../common/exceptions/business.exception';

const mockPrisma = () => ({
  framework: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue(0),
  },
  course: {
    findMany: vi.fn().mockResolvedValue([]),
  },
  task: {
    findMany: vi.fn().mockResolvedValue([]),
  },
  $transaction: vi.fn().mockImplementation(async (callbacks) => callbacks(prisma)),
});

describe('FrameworksService', () => {
  let service: FrameworksService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(async () => {
    prisma = mockPrisma() as Record<string, ReturnType<typeof vi.fn>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FrameworksService,
        { provide: PrismaService, useValue: prisma },
        { provide: AiService, useValue: { completeJson: vi.fn().mockResolvedValue({}) } },
        { provide: RagService, useValue: { indexDocument: vi.fn().mockResolvedValue(0), retrieveContext: vi.fn().mockResolvedValue('') } },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('default-value'),
          },
        },
      ],
    }).compile();

    service = module.get<FrameworksService>(FrameworksService);
  });

  describe('create', () => {
    it('sollte ein Framework erstellen', async () => {
      const createDto: CreateFrameworkDto = {
        bezeichnung: 'Neues Framework',
        kuerzel: 'NF001',
      };

      const createdFramework = { id: 'fw-1', ...createDto };

      prisma.framework.create.mockResolvedValue(createdFramework);

      const result = await service.create(createDto);

      expect(result).toEqual(createdFramework);
      expect(prisma.framework.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            bezeichnung: createDto.bezeichnung,
            kuerzel: createDto.kuerzel,
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('sollte alle Frameworks zurueckgeben', async () => {
      const frameworks = [
        { id: 'fw-1', bezeichnung: 'Framework 1', kuerzel: 'FW1' },
        { id: 'fw-2', bezeichnung: 'Framework 2', kuerzel: 'FW2' },
      ];

      prisma.framework.findMany.mockResolvedValue(frameworks);

      const result = await service.findAll();

      expect(result.data).toEqual(frameworks);
      expect(prisma.framework.findMany).toHaveBeenCalled();
    });

    it('sollte Pagination unterstuetzen', async () => {
      const frameworks = [{ id: 'fw-1', bezeichnung: 'Framework 1', kuerzel: 'FW1' }];

      prisma.framework.findMany.mockResolvedValue(frameworks);
      prisma.framework.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(prisma.framework.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: (2 - 1) * 5,
          take: 5,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('sollte ein Framework zurueckgeben wenn es existiert', async () => {
      const framework = { id: 'fw-1', bezeichnung: 'Test Framework', kuerzel: 'TF001' };

      prisma.framework.findUnique.mockResolvedValue(framework);

      const result = await service.findOne('fw-1');

      expect(result).toEqual(framework);
      expect(prisma.framework.findUnique).toHaveBeenCalledWith({
        where: { id: 'fw-1' },
      });
    });

    it('sollte eine NotFoundException werfen wenn das Framework nicht existiert', async () => {
      prisma.framework.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_FRAMEWORK_NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('sollte ein Framework aktualisieren wenn es existiert', async () => {
      const framework = { id: 'fw-1', bezeichnung: 'Alt', kuerzel: 'AF001' };
      const updateDto: UpdateFrameworkDto = { bezeichnung: 'Neu' };
      const updatedFramework = { ...framework, bezeichnung: 'Neu' };

      prisma.framework.findUnique.mockResolvedValue(framework);
      prisma.framework.update.mockResolvedValue(updatedFramework);

      const result = await service.update('fw-1', updateDto);

      expect(result).toEqual(updatedFramework);
      expect(prisma.framework.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'fw-1' },
          data: { bezeichnung: updateDto.bezeichnung },
        }),
      );
    });

    it('sollte eine NotFoundException werfen wenn das Framework nicht existiert', async () => {
      prisma.framework.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', { bezeichnung: 'Neu' })).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_FRAMEWORK_NOT_FOUND),
      );
    });
  });

  describe('delete', () => {
    it('sollte ein Framework loeschen wenn es existiert', async () => {
      const framework = { id: 'fw-1', bezeichnung: 'Test', kuerzel: 'TF001' };

      prisma.framework.findUnique.mockResolvedValue(framework);
      prisma.framework.delete.mockResolvedValue(framework);

      const result = await service.delete('fw-1');

      expect(result).toEqual(framework);
      expect(prisma.framework.delete).toHaveBeenCalledWith({ where: { id: 'fw-1' } });
    });

    it('sollte eine NotFoundException werfen wenn das Framework nicht existiert', async () => {
      prisma.framework.findUnique.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_FRAMEWORK_NOT_FOUND),
      );
    });
  });

  describe('getTree', () => {
    it('sollte einen Framework-Tree zurueckgeben mit Courses und Tasks', async () => {
      const framework = { id: 'fw-1', bezeichnung: 'Framework', kuerzel: 'FW1' };
      const courses = [{ id: 'c1', titel: 'Course 1' }];
      const tasks = [{ id: 't1', titel: 'Task 1' }];

      prisma.framework.findUnique.mockResolvedValue(framework);
      prisma.course.findMany.mockResolvedValue(courses);
      prisma.task.findMany.mockResolvedValue(tasks);

      const result = await service.getTree('fw-1');

      expect(result.framework).toEqual(framework);
      expect(result.courses).toEqual(courses);
      expect(result.tasks).toEqual(tasks);
    });

    it('sollte eine NotFoundException werfen wenn das Framework nicht existiert', async () => {
      prisma.framework.findUnique.mockResolvedValue(null);

      await expect(service.getTree('non-existent')).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_FRAMEWORK_NOT_FOUND),
      );
    });
  });
});