import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto } from './dto/learning-content.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const framework = await this.prisma.framework.findUnique({
      where: { id: dto.frameworkId },
    });
    if (!framework) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.FRAMEWORK_NOT_FOUND,
        message: `Framework ${dto.frameworkId} nicht gefunden`,
      });
    }
    const task = await this.prisma.task.create({
      data: {
        frameworkId: dto.frameworkId,
        courseId: dto.courseId,
        titel: dto.titel,
        beschreibung: dto.beschreibung,
        musterloesung: dto.musterloesung,
        freigegeben: false,
      },
    });
    return this.toResponse(task);
  }

  async findAll(currentUser: CurrentUser): Promise<TaskResponseDto[]> {
    const releasedOnly = !this.canRelease(currentUser);
    const tasks = await this.prisma.task.findMany({
      where: releasedOnly ? { freigegeben: true } : {},
      orderBy: { titel: 'asc' },
    });
    return tasks.map((t) => this.toResponse(t));
  }

  async findOne(id: string, currentUser: CurrentUser): Promise<TaskResponseDto> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.TASK_NOT_FOUND,
        message: `Task ${id} nicht gefunden`,
      });
    }
    if (!task.freigegeben && !this.canRelease(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.COURSE_NOT_RELEASED,
        message: 'Aufgabe ist noch nicht freigegeben',
      });
    }
    return this.toResponse(task);
  }

  async release(id: string, currentUser: CurrentUser): Promise<TaskResponseDto> {
    this.assertReleaser(currentUser);
    await this.findOne(id, currentUser);
    const task = await this.prisma.task.update({
      where: { id },
      data: { freigegeben: true },
    });
    return this.toResponse(task);
  }

  async unrelease(
    id: string,
    currentUser: CurrentUser,
  ): Promise<TaskResponseDto> {
    this.assertReleaser(currentUser);
    await this.findOne(id, currentUser);
    const task = await this.prisma.task.update({
      where: { id },
      data: { freigegeben: false },
    });
    return this.toResponse(task);
  }

  async update(
    id: string,
    dto: UpdateTaskDto,
    currentUser: CurrentUser,
  ): Promise<TaskResponseDto> {
    this.assertReleaser(currentUser);
    await this.findOne(id, currentUser);
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.frameworkId ? { frameworkId: dto.frameworkId } : {}),
        ...(dto.courseId !== undefined ? { courseId: dto.courseId } : {}),
        ...(dto.titel ? { titel: dto.titel } : {}),
        ...(dto.beschreibung !== undefined ? { beschreibung: dto.beschreibung } : {}),
        ...(dto.musterloesung !== undefined ? { musterloesung: dto.musterloesung } : {}),
      },
    });
    return this.toResponse(task);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  private canRelease(user: CurrentUser): boolean {
    return user.roles.some((r) => r === Role.ausbilder || r === Role.admin);
  }

  private assertReleaser(user: CurrentUser): void {
    if (!this.canRelease(user)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/Admin dürfen freigeben',
      });
    }
  }

  private toResponse(task: {
    id: string;
    frameworkId: string;
    courseId: string | null;
    titel: string;
    beschreibung: string | null;
    musterloesung: string | null;
    freigegeben: boolean;
    kiGeneriert: boolean;
  }): TaskResponseDto {
    return {
      id: task.id,
      frameworkId: task.frameworkId,
      courseId: task.courseId,
      titel: task.titel,
      beschreibung: task.beschreibung,
      musterloesung: task.musterloesung,
      freigegeben: task.freigegeben,
      kiGeneriert: task.kiGeneriert,
    };
  }
}
