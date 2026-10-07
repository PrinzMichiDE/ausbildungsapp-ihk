import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { CreateStandortDto, UpdateStandortDto, StandortResponseDto } from './dto/standort.dto.js';

@Injectable()
export class StandortService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<StandortResponseDto[]> {
    const standorte = await this.prisma.standort.findMany({ orderBy: { name: 'asc' } });
    return standorte.map(s => this.toResponse(s));
  }

  async findOne(id: string): Promise<StandortResponseDto> {
    const standort = await this.prisma.standort.findUnique({ where: { id } });
    if (!standort) {
      throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: `Standort ${id} nicht gefunden` });
    }
    return this.toResponse(standort);
  }

  async create(dto: CreateStandortDto): Promise<StandortResponseDto> {
    const standort = await this.prisma.standort.create({ data: dto });
    return this.toResponse(standort);
  }

  async update(id: string, dto: UpdateStandortDto): Promise<StandortResponseDto> {
    await this.findOne(id);
    const standort = await this.prisma.standort.update({ where: { id }, data: dto });
    return this.toResponse(standort);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.standort.delete({ where: { id } });
  }

  private toResponse(s: {
    id: string; name: string; adresse: string | null; plz: string | null; ort: string | null;
  }): StandortResponseDto {
    return {
      id: s.id, name: s.name, adresse: s.adresse, plz: s.plz, ort: s.ort,
    };
  }
}