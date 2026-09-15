import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PruefungsStatus } from '@prisma/client';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  PruefungResponseDto,
  CreatePruefungDto,
  UpdatePruefungDto,
  PruefungsMeilensteinResponseDto,
  CreateMeilensteinDto,
  UpdateMeilensteinDto,
} from './dto/exams.dto.js';

@Injectable()
export class PruefungService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(
    currentUser: CurrentUser,
    dto: CreatePruefungDto,
  ): Promise<PruefungResponseDto> {
    const azubiId = currentUser.azubiId;
    if (!azubiId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Azubi-Profil',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);

    const pruefung = await this.prisma.pruefung.create({
      data: {
        azubiId,
        typ: 'ap2',
        status: 'angemeldet',
        beschreibung: dto.beschreibung ?? null,
        ihkTermin: dto.ihkTermin ? new Date(dto.ihkTermin) : null,
      },
    });
    return this.toResponse(pruefung);
  }

  async findAll(currentUser: CurrentUser): Promise<PruefungResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.pruefung.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { meilensteine: true },
    });
    return items.map((p) => this.toResponse(p));
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<PruefungResponseDto> {
    const pruefung = await this.prisma.pruefung.findUnique({
      where: { id },
      include: { meilensteine: true },
    });
    if (!pruefung) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.PRUEFUNG_NOT_FOUND,
        message: `Prüfung ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, pruefung.azubiId);
    return this.toResponse(pruefung);
  }

  async update(
    id: string,
    currentUser: CurrentUser,
    dto: UpdatePruefungDto,
  ): Promise<PruefungResponseDto> {
    const pruefung = await this.findOne(id, currentUser);
    if (pruefung.status !== 'angemeldet') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PRUEFUNG_NOT_FOUND,
        message: 'Nur angemeldete Prüfungen können bearbeitet werden',
      });
    }
    const updated = await this.prisma.pruefung.update({
      where: { id },
      data: {
        ...(dto.beschreibung !== undefined
          ? { beschreibung: dto.beschreibung }
          : {}),
        ...(dto.ihkTermin !== undefined
          ? { ihkTermin: dto.ihkTermin ? new Date(dto.ihkTermin) : null }
          : {}),
      },
    });
    return this.toResponse(updated);
  }

  async addMeilenstein(
    pruefungId: string,
    currentUser: CurrentUser,
    dto: CreateMeilensteinDto,
  ): Promise<PruefungsMeilensteinResponseDto> {
    const _pruefung = await this.findOne(pruefungId, currentUser);
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/HR/Admin dürfen Meilensteine anlegen',
      });
    }
    const meilenstein = await this.prisma.pruefungsMeilenstein.create({
      data: {
        pruefungId,
        titel: dto.titel,
        beschreibung: dto.beschreibung ?? null,
        faelligAm: dto.faelligAm ? new Date(dto.faelligAm) : null,
      },
    });
    return this.toMeilensteinResponse(meilenstein);
  }

  async updateMeilenstein(
    pruefungId: string,
    meilensteinId: string,
    currentUser: CurrentUser,
    dto: UpdateMeilensteinDto,
  ): Promise<PruefungsMeilensteinResponseDto> {
    const meilenstein = await this.prisma.pruefungsMeilenstein.findUnique({
      where: { id: meilensteinId },
    });
    if (!meilenstein) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.PRUEFUNGS_MEILENSTEIN_NOT_FOUND,
        message: `Meilenstein ${meilensteinId} nicht gefunden`,
      });
    }
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/HR/Admin dürfen Meilensteine bearbeiten',
      });
    }
    const updated = await this.prisma.pruefungsMeilenstein.update({
      where: { id: meilensteinId },
      data: {
        ...(dto.titel !== undefined ? { titel: dto.titel } : {}),
        ...(dto.beschreibung !== undefined
          ? { beschreibung: dto.beschreibung }
          : {}),
        ...(dto.faelligAm !== undefined
          ? { faelligAm: dto.faelligAm ? new Date(dto.faelligAm) : null }
          : {}),
      },
    });
    return this.toMeilensteinResponse(updated);
  }

  async completeMeilenstein(
    pruefungId: string,
    meilensteinId: string,
    currentUser: CurrentUser,
  ): Promise<PruefungsMeilensteinResponseDto> {
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/HR/Admin dürfen Meilensteine vervollständigen',
      });
    }
    const meilenstein = await this.prisma.pruefungsMeilenstein.findUnique({
      where: { id: meilensteinId },
    });
    if (!meilenstein) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.PRUEFUNGS_MEILENSTEIN_NOT_FOUND,
        message: `Meilenstein ${meilensteinId} nicht gefunden`,
      });
    }
    const updated = await this.prisma.pruefungsMeilenstein.update({
      where: { id: meilensteinId },
      data: {
        erledigt: true,
        erledigtAm: new Date(),
      },
    });
    return this.toMeilensteinResponse(updated);
  }

  async statusChange(
    id: string,
    currentUser: CurrentUser,
    status: string,
  ): Promise<PruefungResponseDto> {
    const _pruefung = await this.findOne(id, currentUser);
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/HR/Admin dürfen den Status ändern',
      });
    }
    const validStatuses = [
      'angemeldet',
      'teilgenommen',
      'bestanden',
      'wiederholung',
    ];
    if (!validStatuses.includes(status)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: `Ungültiger Status. Erlaubt: ${validStatuses.join(', ')}`,
      });
    }
    const updated = await this.prisma.pruefung.update({
      where: { id },
      data: { status: status as PruefungsStatus },
    });
    return this.toResponse(updated);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const pruefung = await this.findOne(id, currentUser);
    if (pruefung.status !== 'angemeldet') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PRUEFUNG_NOT_FOUND,
        message: 'Nur angemeldete Prüfungen können gelöscht werden',
      });
    }
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    await this.prisma.pruefung.delete({ where: { id } });
  }

  private async scopeWhere(currentUser: CurrentUser) {
    if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
      return { azubiId: currentUser.azubiId };
    }
    const visible = await this.scope.getVisibleAzubiIds(currentUser);
    if (visible === 'ALL') {
      return {};
    }
    return { azubiId: { in: [...visible] } };
  }

  private canManage(user: CurrentUser): boolean {
    return user.roles.some(
      (r) => r === Role.ausbilder || r === Role.hr || r === Role.admin,
    );
  }

  private toResponse(p: {
    id: string;
    azubiId: string;
    typ: string;
    status: string;
    beschreibung: string | null;
    ihkTermin: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): PruefungResponseDto {
    return {
      id: p.id,
      azubiId: p.azubiId,
      typ: p.typ,
      status: p.status,
      beschreibung: p.beschreibung,
      ihkTermin: p.ihkTermin,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  private toMeilensteinResponse(m: {
    id: string;
    pruefungId: string;
    titel: string;
    beschreibung: string | null;
    faelligAm: Date | null;
    erledigt: boolean;
    erledigtAm: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): PruefungsMeilensteinResponseDto {
    return {
      id: m.id,
      pruefungId: m.pruefungId,
      titel: m.titel,
      beschreibung: m.beschreibung,
      faelligAm: m.faelligAm,
      erledigt: m.erledigt,
      erledigtAm: m.erledigtAm,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    };
  }
}