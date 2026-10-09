import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { RagService } from '../ai/rag.service.js';
import { ConfigService } from '@nestjs/config';
import { CoursesService } from './courses.service';
import { CreateCourseDto, UpdateCourseDto, ReleaseCourseDto } from './dto/learning-content.dto';
import { ErrorCodes } from '../../common/constants/error-codes';
import { Roles } from '../../common/constants/roles';
import { BusinessException } from '../../common/exceptions/business.exception';

const mockPrisma = () => ({
  course: {
    findMany: vi.fn().mockResolvedValue([]),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
    delete: vi.fn().mockResolvedValue({}),
    count: vi.fn().mockResolvedValue(0),
  },
  framework: {
    findUnique: vi.fn().mockResolvedValue(null),
  },
  $transaction: vi.fn().mockImplementation(async (callbacks) => callbacks(prisma)),
});

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: Record<string, any>;

  const currentUser = {
    id: 'user-1',
    email: 'test@example.com',
    roles: [Roles.AUSBILDER],
  };

  beforeEach(async () => {
    prisma = mockPrisma() as Record<string, any>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
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

    service = module.get<CoursesService>(CoursesService);
  });

  it('sollte eine Course erstellen wenn das Framework existiert', async () => {
    const createDto: CreateCourseDto = {
      titel: 'Neue Course',
      kuerzel: 'NC001',
      kennzahl: 'KEN-001',
    };

    const framework = { id: 'fw-1' };
    const createdCourse = { id: 'course-1', ...createDto, frameworkId: 'fw-1', freigegeben: false };

    prisma.framework.findUnique.mockResolvedValue(framework);
    prisma.course.create.mockResolvedValue(createdCourse);

    const result = await service.create(createDto, currentUser);

    expect(result).toEqual(createdCourse);
    expect(prisma.framework.findUnique).toHaveBeenCalledWith({
      where: { id: createDto.frameworkId },
    });
    expect(prisma.course.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          titel: createDto.titel,
          kennzahl: createDto.kennzahl,
        }),
      }),
    );
  });

  it('sollte eine BadRequestException werfen wenn das Framework nicht gefunden wird', async () => {
    const createDto: CreateCourseDto = {
      titel: 'Neue Course',
      kuerzel: 'NC001',
      kennzahl: 'KEN-001',
    };

    prisma.framework.findUnique.mockResolvedValue(null);

    await expect(service.create(createDto, currentUser)).rejects.toThrow(BadRequestException);
    expect(prisma.framework.findUnique).toHaveBeenCalledWith({
      where: { id: createDto.frameworkId },
    });
  });

  describe('findAll', () => {
    it('sollte nur freigegebene Courses zurueckgeben wenn released=true', async () => {
      const releasedCourses = [
        { id: 'c1', titel: 'C1', freigegeben: true },
        { id: 'c2', titel: 'C2', freigegeben: true },
      ];

      prisma.course.findMany.mockResolvedValue(releasedCourses);

      const result = await service.findAll({ released: true });

      expect(result.data).toEqual(releasedCourses);
      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ freigegeben: true }),
        }),
      );
    });

    it('sollte alle Courses zurueckgeben wenn released=false', async () => {
      const allCourses = [
        { id: 'c1', titel: 'C1', freigegeben: true },
        { id: 'c2', titel: 'C2', freigegeben: false },
      ];

      prisma.course.findMany.mockResolvedValue(allCourses);

      const result = await service.findAll({ released: false });

      expect(result.data).toEqual(allCourses);
      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
      });
    });

    it('sollte Pagination unterstuetzen', async () => {
      const page = 2;
      const limit = 5;
      const courses = [{ id: 'c3', titel: 'C3', freigegeben: true }];

      prisma.course.findMany.mockResolvedValue(courses);
      prisma.course.count.mockResolvedValue(1);

      const result = await service.findAll({ page, limit });

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: (page - 1) * limit,
          take: limit,
        }),
      );
    });
  });

  describe('findOne', () => {
    it('sollte eine Course zurueckgeben wenn sie existiert', async () => {
      const course = { id: 'c1', titel: 'Test Course', freigegeben: true, kuerzel: 'TC001' };

      prisma.course.findUnique.mockResolvedValue(course);

      const result = await service.findOne('c1');

      expect(result).toEqual(course);
      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 'c1' },
      });
    });

    it('sollte eine NotFoundException werfen wenn die Course nicht existiert', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_COURSE_NOT_FOUND),
      );
    });

    it('sollte eine NotFoundException werfen wenn Course nicht freigegeben ist', async () => {
      const unpublishedCourse = { id: 'c1', titel: 'Unpublished', freigegeben: false };

      prisma.course.findUnique.mockResolvedValue(unpublishedCourse);

      await expect(service.findOne('c1')).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_COURSE_NOT_FOUND),
      );
    });
  });

  describe('release', () => {
    it('sollte eine Course freigeben wenn der Benutzer die Berechtigung hat', async () => {
      const course = { id: 'c1', titel: 'Test', freigegeben: false, kuerzel: 'TC001' };
      const releasedCourse = { ...course, freigegeben: true };

      prisma.course.findUnique.mockResolvedValue(course);
      prisma.course.update.mockResolvedValue(releasedCourse);

      const result = await service.release('c1', ReleaseCourseDto, currentUser);

      expect(result).toEqual(releasedCourse);
      expect(prisma.course.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c1' },
          data: { freigegeben: true },
        }),
      );
    });

    it('sollte eine ForbiddenException werfen wenn der Benutzer nicht freigeben darf', async () => {
      const course = { id: 'c1', titel: 'Test', freigegeben: false };
      const unauthorizedUser = { ...currentUser, roles: [Roles.AZUBI] };

      prisma.course.findUnique.mockResolvedValue(course);

      await expect(service.release('c1', ReleaseCourseDto, unauthorizedUser)).rejects.toThrow(ForbiddenException);
    });

    it('sollte eine NotFoundException werfen wenn die Course nicht existiert', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      await expect(service.release('c1', ReleaseCourseDto, currentUser)).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_COURSE_NOT_FOUND),
      );
    });
  });

  describe('unrelease', () => {
    it('sollte eine Course zuruecknehmen wenn der Benutzer die Berechtigung hat', async () => {
      const course = { id: 'c1', titel: 'Test', freigegeben: true, kuerzel: 'TC001' };
      const unpublishedCourse = { ...course, freigegeben: false };

      prisma.course.findUnique.mockResolvedValue(course);
      prisma.course.update.mockResolvedValue(unpublishedCourse);

      const result = await service.unrelease('c1', currentUser);

      expect(result).toEqual(unpublishedCourse);
      expect(prisma.course.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c1' },
          data: { freigegeben: false },
        }),
      );
    });

    it('sollte eine ForbiddenException werfen wenn der Benutzer nicht zuruecknehmen darf', async () => {
      const course = { id: 'c1', titel: 'Test', freigegeben: true };
      const unauthorizedUser = { ...currentUser, roles: [Roles.AZUBI] };

      prisma.course.findUnique.mockResolvedValue(course);

      await expect(service.unrelease('c1', unauthorizedUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('sollte eine Course aktualisieren wenn sie existiert', async () => {
      const course = { id: 'c1', titel: 'Alt', freigegeben: true, kuerzel: 'TC001' };
      const updateDto: UpdateCourseDto = { titel: 'Neu' };
      const updatedCourse = { ...course, titel: 'Neu' };

      prisma.course.findUnique.mockResolvedValue(course);
      prisma.course.update.mockResolvedValue(updatedCourse);

      const result = await service.update('c1', updateDto, currentUser);

      expect(result).toEqual(updatedCourse);
      expect(prisma.course.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'c1' },
          data: { titel: updateDto.titel },
        }),
      );
    });

    it('sollte eine NotFoundException werfen wenn die Course nicht existiert', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { titel: 'Neu' }, currentUser),
      ).rejects.toThrow(new BusinessException(ErrorCodes.LEARNING_CONTENT_COURSE_NOT_FOUND));
    });
  });

  describe('remove', () => {
    it('sollte eine Course loeschen wenn sie existiert', async () => {
      const course = { id: 'c1', titel: 'Test', freigegeben: false };

      prisma.course.findUnique.mockResolvedValue(course);
      prisma.course.delete.mockResolvedValue(course);

      const result = await service.remove('c1', currentUser);

      expect(result).toEqual(course);
      expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
    });

    it('sollte eine NotFoundException werfen wenn die Course nicht existiert', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent', currentUser)).rejects.toThrow(
        new BusinessException(ErrorCodes.LEARNING_CONTENT_COURSE_NOT_FOUND),
      );
    });
  });
});