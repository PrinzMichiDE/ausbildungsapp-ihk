import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  AbteilungResponseDto,
  CreateAbteilungDto,
  UpdateAbteilungDto,
} from './dto/abteilung.dto.js';

@Injectable()
export class AbteilungenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAbteilungDto): Promise<AbteilungResponseDto> {
    const abteilung = await this.prisma.abteilung.create({ data: dto });
    return this.toResponse(abteilung);
  }

  async findAll(): Promise<AbteilungResponseDto[]> {
    const abteilungen = await this.prisma.abteilung.findMany({
      orderBy: { name: 'asc' },
    });
    return abteilungen.map((a) => this.toResponse(a));
  }

  async findOne(id: string): Promise<AbteilungResponseDto> {
    const abteilung = await this.prisma.abteilung.findUnique({
      where: { id },
    });
    if (!abteilung) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.NOT_FOUND,
        message: `Abteilung ${id} nicht gefunden`,
      });
    }
    return this.toResponse(abteilung);
  }

  async update(
    id: string,
    dto: UpdateAbteilungDto,
  ): Promise<AbteilungResponseDto> {
    await this.findOne(id);
    const abteilung = await this.prisma.abteilung.update({
      where: { id },
      data: dto,
    });
    return this.toResponse(abteilung);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.abteilung.delete({ where: { id } });
  }

  private toResponse(abteilung: {
    id: string;
    name: string;
    kurzzeichen: string | null;
    beschreibung: string | null;
  }): AbteilungResponseDto {
    return {
      id: abteilung.id,
      name: abteilung.name,
      kurzzeichen: abteilung.kurzzeichen,
      beschreibung: abteilung.beschreibung,
    };
  }
}
