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
import { ProjektResponseDto, CreateProjektDto, UpdateProjektDto } from './dto/projekt.dto.js';

@Injectable()
export class ProjektService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(
    currentUser: CurrentUser,
    dto: CreateProjektDto,
  ): Promise<ProjektResponseDto> {
    const azubiId = currentUser.azubiId;
    if (!azubiId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Azubi-Profil',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);

    const projekt = await this.prisma.projekt.create({
      data: {
        azubiId,
        titel: dto.titel,
        beschreibung: dto.beschreibung ?? null,
        projektantrag: dto.projektantrag ?? null,
        projektdoku: dto.projektdoku ?? null,
        status: 'entwurf',
        freigegeben: false,
      },
    });
    return this.toResponse(projekt);
  }

  async findAll(currentUser: CurrentUser): Promise<ProjektResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.projekt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return items.map((p) => this.toResponse(p));
  }

  async findOne(id: string, currentUser: CurrentUser): Promise<ProjektResponseDto> {
    const projekt = await this.prisma.projekt.findUnique({ where: { id } });
    if (!projekt) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
        message: `Projekt ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, projekt.azubiId);
    return this.toResponse(projekt);
  }

  async update(
    id: string,
    currentUser: CurrentUser,
    dto: UpdateProjektDto,
  ): Promise<ProjektResponseDto> {
    const projekt = await this.findOne(id, currentUser);
    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      projekt.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    if (projekt.status !== 'entwurf' && projekt.status !== 'abgelehnt') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
        message: 'Projekt kann in diesem Status nicht bearbeitet werden',
      });
    }
    const updated = await this.prisma.projekt.update({
      where: { id },
      data: {
        ...(dto.titel ? { titel: dto.titel } : {}),
        ...(dto.beschreibung !== undefined ? { beschreibung: dto.beschreibung } : {}),
        ...(dto.projektantrag !== undefined ? { projektantrag: dto.projektantrag } : {}),
        ...(dto.projektdoku !== undefined ? { projektdoku: dto.projektdoku } : {}),
      },
    });
    return this.toResponse(updated);
  }

  async submit(id: string, currentUser: CurrentUser): Promise<ProjektResponseDto> {
    const projekt = await this.findOne(id, currentUser);
    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      projekt.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur der Azubi oder ein Manager dürfen den Projektantrag einreichen',
      });
    }
    if (projekt.status !== 'entwurf') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
        message: 'Nur Entwürfe können eingereicht werden',
      });
    }
    const updated = await this.prisma.projekt.update({
      where: { id },
      data: { status: 'eingereicht' },
    });
    return this.toResponse(updated);
  }

  async review(
    id: string,
    currentUser: CurrentUser,
    dto: { bewertung: string; status: 'freigegeben' | 'abgelehnt' },
  ): Promise<ProjektResponseDto> {
    const projekt = await this.findOne(id, currentUser);
    if (!this.canReview(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/HR/Admin dürfen Projekte reviewen',
      });
    }
    if (projekt.status !== 'eingereicht' && projekt.status !== 'in_pruefung') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
        message: 'Projekt ist nicht zur Prüfung freigegeben',
      });
    }
    const updated = await this.prisma.projekt.update({
      where: { id },
      data: {
        status: dto.status,
        bewertung: dto.bewertung,
        bewertetVon: currentUser.id,
        bewertetAm: new Date(),
        freigegeben: dto.status === 'freigegeben',
      },
    });
    return this.toResponse(updated);
  }

  async requestRevision(id: string, currentUser: CurrentUser): Promise<ProjektResponseDto> {
    const projekt = await this.findOne(id, currentUser);
    if (!this.canReview(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/HR/Admin dürfen Überarbeitung anfordern',
      });
    }
    if (projekt.status !== 'eingereicht' && projekt.status !== 'in_pruefung') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
        message: 'Projekt ist nicht zur Prüfung freigegeben',
      });
    }
    const updated = await this.prisma.projekt.update({
      where: { id },
      data: { status: 'in_pruefung' },
    });
    return this.toResponse(updated);
  }

  async archive(id: string, currentUser: CurrentUser): Promise<void> {
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/Admin dürfen Projekte archivieren',
      });
    }
    await this.prisma.projekt.update({
      where: { id },
      data: { status: 'archiviert' },
    });
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const projekt = await this.findOne(id, currentUser);
    if (projekt.status !== 'entwurf' && projekt.status !== 'abgelehnt') {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.PROJEKT_NOT_FOUND,
        message: 'Nur Entwürfe und abgelehnte Projekte können gelöscht werden',
      });
    }
    if (!this.canManage(currentUser) && !(currentUser.roles.includes(Role.azubi) && projekt.azubiId === currentUser.azubiId)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    await this.prisma.projekt.delete({ where: { id } });
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

  private canReview(user: CurrentUser): boolean {
    return user.roles.some(
      (r) => r === Role.ausbilder || r === Role.hr || r === Role.admin,
    );
  }

  private toResponse(p: {
    id: string;
    azubiId: string;
    titel: string;
    beschreibung: string | null;
    projektantrag: string | null;
    projektdoku: string | null;
    status: string;
    bewertung: string | null;
    bewertetVon: string | null;
    bewertetAm: Date | null;
    freigegeben: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ProjektResponseDto {
    return {
      id: p.id,
      azubiId: p.azubiId,
      titel: p.titel,
      beschreibung: p.beschreibung,
      projektantrag: p.projektantrag,
      projektdoku: p.projektdoku,
      status: p.status,
      bewertung: p.bewertung,
      bewertetVon: p.bewertetVon,
      bewertetAm: p.bewertetAm,
      freigegeben: p.freigegeben,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }
}