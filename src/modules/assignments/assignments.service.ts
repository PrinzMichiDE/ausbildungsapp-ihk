import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  CreateEinsatzDto,
  EinsatzResponseDto,
  UpdateEinsatzDto,
} from './dto/assignments.dto.js';

@Injectable()
export class EinsatzService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(dto: CreateEinsatzDto): Promise<EinsatzResponseDto> {
    const azubi = await this.prisma.user.findUnique({
      where: { id: dto.azubiId },
    });
    if (!azubi) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.USER_NOT_FOUND,
        message: `Azubi ${dto.azubiId} nicht gefunden`,
      });
    }
    const einsatz = await this.prisma.einsatz.create({
      data: {
        azubiId: dto.azubiId,
        abteilungId: dto.abteilungId,
        von: new Date(dto.von),
        bis: new Date(dto.bis),
        skillLevel: dto.skillLevel ?? 0,
      },
    });
    return this.toResponse(einsatz);
  }

  async findAll(currentUser: CurrentUser): Promise<EinsatzResponseDto[]> {
    const where = await this.buildScopeWhere(currentUser);
    const einsaetze = await this.prisma.einsatz.findMany({
      where,
      include: { azubi: true, abteilung: true },
      orderBy: { von: 'asc' },
    });
    return einsaetze.map((e) => ({
      ...this.toResponse(e),
      azubiName: `${e.azubi.firstName} ${e.azubi.lastName}`,
      abteilungName: e.abteilung.name,
    })) as EinsatzResponseDto[];
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<EinsatzResponseDto> {
    const einsatz = await this.prisma.einsatz.findUnique({ where: { id } });
    if (!einsatz) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.EINSAZ_NOT_FOUND,
        message: `Einsatz ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, einsatz.azubiId);
    return this.toResponse(einsatz);
  }

  async update(
    id: string,
    dto: UpdateEinsatzDto,
    currentUser: CurrentUser,
  ): Promise<EinsatzResponseDto> {
    this.assertAusbilder(currentUser);
    await this.findOne(id, currentUser);
    const einsatz = await this.prisma.einsatz.update({
      where: { id },
      data: {
        ...(dto.abteilungId ? { abteilungId: dto.abteilungId } : {}),
        ...(dto.von ? { von: new Date(dto.von) } : {}),
        ...(dto.bis ? { bis: new Date(dto.bis) } : {}),
        ...(dto.skillLevel !== undefined ? { skillLevel: dto.skillLevel } : {}),
      },
    });
    return this.toResponse(einsatz);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    this.assertAusbilder(currentUser);
    await this.findOne(id, currentUser);
    await this.prisma.einsatz.delete({ where: { id } });
  }

  async getPlan(currentUser: CurrentUser) {
    const where = await this.buildScopeWhere(currentUser);
    const now = new Date();
    return this.prisma.einsatz.findMany({
      where: { ...where, bis: { gte: now } },
      include: { azubi: true, abteilung: true },
      orderBy: [{ von: 'asc' }, { abteilungId: 'asc' }],
    });
  }

  private async buildScopeWhere(currentUser: CurrentUser) {
    if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
      return { azubiId: currentUser.azubiId };
    }
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    if (visible === 'ALL') {
      return {};
    }
    return { azubiId: { in: [...visible] } };
  }

  private assertAusbilder(currentUser: CurrentUser): void {
    if (!currentUser.roles.includes(Role.ausbilder)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder dürfen Einsätze verwalten',
      });
    }
  }

  private toResponse(einsatz: {
    id: string;
    azubiId: string;
    abteilungId: string;
    von: Date;
    bis: Date;
    skillLevel: number;
  }): EinsatzResponseDto {
    return {
      id: einsatz.id,
      azubiId: einsatz.azubiId,
      abteilungId: einsatz.abteilungId,
      von: einsatz.von,
      bis: einsatz.bis,
      skillLevel: einsatz.skillLevel,
    };
  }
}
