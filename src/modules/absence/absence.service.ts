import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AbwesenheitQuelle, AbwesenheitTyp } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  AbwesenheitResponseDto,
  CreateAbwesenheitDto,
  UpdateAbwesenheitDto,
} from './dto/absence.dto.js';

@Injectable()
export class AbwesenheitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(
    currentUser: CurrentUser,
    dto: CreateAbwesenheitDto,
  ): Promise<AbwesenheitResponseDto> {
    let azubiId: string;
    if (currentUser.roles.includes(Role.azubi) && currentUser.azubiId) {
      azubiId = currentUser.azubiId;
      if (dto.azubiId && dto.azubiId !== azubiId) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Azubis dürfen nur eigene Abwesenheiten erfassen',
        });
      }
    } else {
      if (!dto.azubiId) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.BAD_REQUEST,
          message: 'azubiId ist erforderlich',
        });
      }
      await this.scope.assertCanAccessAzubi(currentUser, dto.azubiId);
      azubiId = dto.azubiId;
    }
    const abwesenheit = await this.prisma.abwesenheit.create({
      data: {
        azubiId,
        typ: dto.typ,
        quelle: dto.quelle ?? AbwesenheitQuelle.manuell,
        von: new Date(dto.von),
        bis: new Date(dto.bis),
        notiz: dto.notiz,
      },
    });
    return this.toResponse(abwesenheit);
  }

  async findAll(currentUser: CurrentUser): Promise<AbwesenheitResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.abwesenheit.findMany({
      where,
      orderBy: { von: 'desc' },
    });
    return items.map((a) => this.toResponse(a));
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<AbwesenheitResponseDto> {
    const abwesenheit = await this.prisma.abwesenheit.findUnique({
      where: { id },
    });
    if (!abwesenheit) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.ABWESENHEIT_NOT_FOUND,
        message: `Abwesenheit ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, abwesenheit.azubiId);
    return this.toResponse(abwesenheit);
  }

  async update(
    id: string,
    currentUser: CurrentUser,
    dto: UpdateAbwesenheitDto,
  ): Promise<AbwesenheitResponseDto> {
    const existing = await this.findOne(id, currentUser);
    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      existing.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    const updated = await this.prisma.abwesenheit.update({
      where: { id },
      data: {
        ...(dto.typ ? { typ: dto.typ } : {}),
        ...(dto.von ? { von: new Date(dto.von) } : {}),
        ...(dto.bis ? { bis: new Date(dto.bis) } : {}),
        ...(dto.notiz !== undefined ? { notiz: dto.notiz } : {}),
      },
    });
    return this.toResponse(updated);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const existing = await this.findOne(id, currentUser);
    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      existing.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }
    await this.prisma.abwesenheit.delete({ where: { id } });
  }

  private async resolveAzubiId(
    currentUser: CurrentUser,
    requested?: string,
  ): Promise<string> {
    if (currentUser.roles.includes(Role.azubi)) {
      if (!currentUser.azubiId) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Kein Azubi-Profil',
        });
      }
      if (requested && requested !== currentUser.azubiId) {
        throw new ForbiddenException({
          errorCode: ERROR_CODES.ACCESS_DENIED,
          message: 'Azubis dürfen nur eigene Abwesenheiten erfassen',
        });
      }
      return currentUser.azubiId;
    }
    if (!requested) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: 'azubiId ist erforderlich',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, requested);
    return requested;
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
      (r) =>
        r === Role.ausbilder || r === Role.hr || r === Role.admin,
    );
  }

  private toResponse(a: {
    id: string;
    azubiId: string;
    typ: AbwesenheitTyp;
    quelle: AbwesenheitQuelle;
    von: Date;
    bis: Date;
    notiz: string | null;
  }): AbwesenheitResponseDto {
    return {
      id: a.id,
      azubiId: a.azubiId,
      typ: a.typ,
      quelle: a.quelle,
      von: a.von,
      bis: a.bis,
      notiz: a.notiz,
    };
  }
}
