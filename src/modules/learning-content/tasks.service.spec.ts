import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { RagService } from '../ai/rag.service.js';
import { ConfigService } from '@nestjs/config';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/learning-content.dto';
import { ErrorCodes } from '../../common/constants/error-codes';
import { Roles } from '../../common/constants/roles';
import { BusinessException } from '../../common/exceptions/business.exception';

const mockPrisma = () => ({
  task: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue(0),
  },
  course: {
    findUnique: vi.fn().mockResolvedValue(null),
  },
  framework: {
    findUnique: vi.fn().mockResolvedValue(null),
  },
  $transaction: vi.fn().mockImplementation(async (callbacks) => callbacks(prisma)),
});

describe('TasksService', () => {
  let service: TasksService;
  let prisma: Record<string, ReturnType<typeof vi.fn>>;

  const currentUser = {
    id: 'user-1',
    email: 'test@example.com',
    roles: [Roles.AUSBILDERS],
  };

  beforeEach(async () => {
    prisma = mockPrisma() as Record<string, ReturnType<typeof vi.fn>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
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

    service = module.get<TasksService>(TasksService);
  });

  it('sollte eine Task erstellen wenn die Course existiert', async () => {
    const createDto: CreateTaskDto = {
      titel: 'Neue Task',
      description: 'Beschreibung',
    };

    const course = { id: 'c1', titel: 'Course 1' };
    const createdTask = { id: 'task-1', ...createDto, courseId: 'c1' };

    prisma.course.findUnique.mockResolvedValue(course);
    prisma.task.create.mockResolvedValue(createdTask);

    const result = await service.create(createDto, currentUser);

    expect(result).toEqual(createdTask);
    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: createDto.courseId },
    });
    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          titel: createDto.titel,
        }),
      }),
    );
  });

  it('sollte eine BadRequestException werfen wenn die Course nicht gefunden wird', async () => {
    const createDto: CreateTaskDto = {
      titel: 'Neue Task',
      description: 'Beschreibung',
    };

    prisma.course.findUnique.mockResolvedValue(null);

    await expect(service.create(createDto, currentUser)).rejects.toThrow(BadRequestException);
    expect(prisma.course.findUnique).toHaveBeenCalledWith({
      where: { id: createDto.courseId },
    });
  });

  describe('findAll', () => {
    it('sollte alle Tasks einer Course zurueckgeben', async () => {
      const tasks = [
        { id: 't1', titel: 'Task 1', courseId: 'c1', freigegeben: true },
        { id: 't2', titel: 'Task 2', courseId: 'c1', freigegeben: true },
      ];

      prisma.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAll({ courseId: 'c1' });

      expect(result.data).toEqual(tasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ courseId: 'c1' }),
        }),
      );
    });

    it('sollte Pagination unterstuetzen', async () => {
      const page = 1;
      const limit = 10;
      const tasks = [{ id: 't1', titel: 'Task 1', courseId: 'c1' }];

      prisma.task.findMany.mockResolvedValue(tasks);
      prisma.task.count.mockResolvedValue(1);

      const result = await service.findAll({ page, limit, courseId: 'c1' });

      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: (page - 1) * limit,
          take: limit,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('sollte eine Task zurueckgeben wenn sie existiert', async () => {
      const task = { id: 't1', titel: 'Test Task', description: 'Beschreibung', freigegeben: true };

      prisma.task.findUnique.mockResolvedValue(task);

      const result = await service.findOne('t1');

      expect(result).toEqual(task);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 't1' },
      });
    });

    it('sollte eine NotFoundException werfen wenn die Task nicht existiert', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_TASK_NOT_FOUND),
      );
    });
  });

  describe('update', () => {
    it('sollte eine Task aktualisieren wenn sie existiert', async () => {
      const task = { id: 't1', titel: 'Alt', description: 'Alt', freigegeben: true };
      const updateDto: UpdateTaskDto = { titel: 'Neu' };
      const updatedTask = { ...task, titel: 'Neu' };

      prisma.task.findUnique.mockResolvedValue(task);
      prisma.task.update.mockResolvedValue(updatedTask);

      const result = await service.update('t1', updateDto, currentUser);

      expect(result).toEqual(updatedTask);
      expect(prisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 't1' },
          data: { titel: updateDto.titel },
        }),
      );
    });

    it('sollte eine NotFoundException werfen wenn die Task nicht existiert', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { titel: 'Neu' }, currentUser),
      ).rejects.toThrow(new BusinessException(ErrorCodes.LEARNING_CONTENT_TASK_NOT_FOUND));
    });
  });

  describe('delete', () => {
    it('sollte eine Task loeschen wenn sie existiert', async () => {
      const task = { id: 't1', titel: 'Test', description: 'Beschreibung' };

      prisma.task.findUnique.mockResolvedValue(task);
      prisma.task.delete.mockResolvedValue(task);

      const result = await service.delete('t1', currentUser);

      expect(result).toEqual(task);
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 't1' } });
    });

    it('sollte eine NotFoundException werfen wenn die Task nicht existiert', async () => {
      prisma.task.findUnique.mockResolvedValue(null);

      await expect(service.delete('non-existent', currentUser)).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_TASK_NOT_FOUND),
      );
    });
  });
});