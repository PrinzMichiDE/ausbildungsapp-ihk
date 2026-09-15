import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  CreateFrameworkDto,
  FrameworkResponseDto,
  UpdateFrameworkDto,
} from './dto/learning-content.dto.js';

@Injectable()
export class FrameworksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFrameworkDto): Promise<FrameworkResponseDto> {
    const framework = await this.prisma.framework.create({ data: dto });
    return this.toResponse(framework);
  }

  async findAll(): Promise<FrameworkResponseDto[]> {
    const frameworks = await this.prisma.framework.findMany({
      orderBy: { titel: 'asc' },
    });
    return frameworks.map((f) => this.toResponse(f));
  }

  async findOne(id: string): Promise<FrameworkResponseDto> {
    const framework = await this.prisma.framework.findUnique({ where: { id } });
    if (!framework) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.FRAMEWORK_NOT_FOUND,
        message: `Framework ${id} nicht gefunden`,
      });
    }
    return this.toResponse(framework);
  }

  async getTree(id: string) {
    const framework = await this.findOne(id);
    const courses = await this.prisma.course.findMany({
      where: { frameworkId: id },
      orderBy: { titel: 'asc' },
    });
    const tasks = await this.prisma.task.findMany({
      where: { frameworkId: id },
      orderBy: { titel: 'asc' },
    });
    return { framework, courses, tasks };
  }

  async update(id: string, dto: UpdateFrameworkDto): Promise<FrameworkResponseDto> {
    await this.findOne(id);
    const framework = await this.prisma.framework.update({
      where: { id },
      data: dto,
    });
    return this.toResponse(framework);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.framework.delete({ where: { id } });
  }

  private toResponse(framework: {
    id: string;
    titel: string;
    lernfeld: string;
    kompetenz: string;
    beschreibung: string | null;
    quelle: string | null;
    createdAt: Date;
  }): FrameworkResponseDto {
    return {
      id: framework.id,
      titel: framework.titel,
      lernfeld: framework.lernfeld,
      kompetenz: framework.kompetenz,
      beschreibung: framework.beschreibung,
      quelle: framework.quelle,
      createdAt: framework.createdAt,
    };
  }
}
