import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  CourseResponseDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './dto/learning-content.dto.js';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCourseDto): Promise<CourseResponseDto> {
    const framework = await this.prisma.framework.findUnique({
      where: { id: dto.frameworkId },
    });
    if (!framework) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.FRAMEWORK_NOT_FOUND,
        message: `Framework ${dto.frameworkId} nicht gefunden`,
      });
    }
    const course = await this.prisma.course.create({
      data: {
        frameworkId: dto.frameworkId,
        titel: dto.titel,
        beschreibung: dto.beschreibung,
        lernziele: dto.lernziele ?? [],
        theorie: dto.theorie,
        freigegeben: false,
      },
    });
    return this.toResponse(course);
  }

  async findAll(currentUser: CurrentUser): Promise<CourseResponseDto[]> {
    const releasedOnly = !this.canRelease(currentUser);
    const courses = await this.prisma.course.findMany({
      where: releasedOnly ? { freigegeben: true } : {},
      orderBy: { titel: 'asc' },
    });
    return courses.map((c) => this.toResponse(c));
  }

  async findOne(id: string, currentUser: CurrentUser): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.COURSE_NOT_FOUND,
        message: `Course ${id} nicht gefunden`,
      });
    }
    if (!course.freigegeben && !this.canRelease(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.COURSE_NOT_RELEASED,
        message: 'Kurs ist noch nicht freigegeben',
      });
    }
    return this.toResponse(course);
  }

  async release(id: string, currentUser: CurrentUser): Promise<CourseResponseDto> {
    this.assertReleaser(currentUser);
    await this.findOne(id, currentUser);
    const course = await this.prisma.course.update({
      where: { id },
      data: { freigegeben: true },
    });
    return this.toResponse(course);
  }

  async unrelease(
    id: string,
    currentUser: CurrentUser,
  ): Promise<CourseResponseDto> {
    this.assertReleaser(currentUser);
    await this.findOne(id, currentUser);
    const course = await this.prisma.course.update({
      where: { id },
      data: { freigegeben: false },
    });
    return this.toResponse(course);
  }

  async update(
    id: string,
    dto: UpdateCourseDto,
    currentUser: CurrentUser,
  ): Promise<CourseResponseDto> {
    this.assertReleaser(currentUser);
    await this.findOne(id, currentUser);
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        ...(dto.frameworkId ? { frameworkId: dto.frameworkId } : {}),
        ...(dto.titel ? { titel: dto.titel } : {}),
        ...(dto.beschreibung !== undefined ? { beschreibung: dto.beschreibung } : {}),
        ...(dto.lernziele !== undefined ? { lernziele: dto.lernziele } : {}),
        ...(dto.theorie !== undefined ? { theorie: dto.theorie } : {}),
      },
    });
    return this.toResponse(course);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }

  private canRelease(user: CurrentUser): boolean {
    return user.roles.some(
      (r) => r === Role.ausbilder || r === Role.admin,
    );
  }

  private assertReleaser(user: CurrentUser): void {
    if (!this.canRelease(user)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/Admin dürfen freigeben',
      });
    }
  }

  private toResponse(course: {
    id: string;
    frameworkId: string;
    titel: string;
    beschreibung: string | null;
    lernziele: string[];
    theorie: string | null;
    freigegeben: boolean;
    kiGeneriert: boolean;
    qualitaetsScore: number | null;
  }): CourseResponseDto {
    return {
      id: course.id,
      frameworkId: course.frameworkId,
      titel: course.titel,
      beschreibung: course.beschreibung,
      lernziele: course.lernziele,
      theorie: course.theorie,
      freigegeben: course.freigegeben,
      kiGeneriert: course.kiGeneriert,
      qualitaetsScore: course.qualitaetsScore,
    };
  }
}
