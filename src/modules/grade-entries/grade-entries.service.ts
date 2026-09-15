import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { CreateGradeEntryDto, GradeEntryResponseDto } from './dto/grade-entry.dto.js';

@Injectable()
export class GradeentryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(currentUser: CurrentUser, dto: CreateGradeEntryDto): Promise<GradeEntryResponseDto> {
    const azubiId = dto.azubiId ?? currentUser.azubiId;
    if (!azubiId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'azubiId ist erforderlich',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);

    const entry = await this.prisma.gradeEntry.create({
      data: {
        azubiId,
        fach: dto.fach,
        halbjahr: dto.halbjahr ?? null,
        note: dto.note,
        datum: dto.datum ?? null,
        pruefungsart: dto.pruefungsart ?? null,
        gewichtung: dto.gewichtung ?? 1.0,
        zeugnisUrl: dto.zeugnisUrl ?? null,
      },
    });
    return this.toResponse(entry);
  }

  async findAll(currentUser: CurrentUser) {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.gradeEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return items.map((e) => this.toResponse(e));
  }

  async findOne(id: string, currentUser: CurrentUser): Promise<GradeEntryResponseDto> {
    const entry = await this.prisma.gradeEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.GRADE_NOT_FOUND,
        message: `GradeEntry ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, entry.azubiId);
    return this.toResponse(entry);
  }

  async update(id: string, currentUser: CurrentUser, dto: { fach?: string; halbjahr?: string; note?: number; datum?: Date; pruefungsart?: string; gewichtung?: number; zeugnisUrl?: string }): Promise<GradeEntryResponseDto> {
    const entry = await this.prisma.gradeEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.GRADE_NOT_FOUND,
        message: `GradeEntry ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, entry.azubiId);

    const updated = await this.prisma.gradeEntry.update({
      where: { id },
      data: {
        ...(dto.fach !== undefined ? { fach: dto.fach } : {}),
        ...(dto.halbjahr !== undefined ? { halbjahr: dto.halbjahr } : {}),
        ...(dto.note !== undefined ? { note: dto.note } : {}),
        ...(dto.datum !== undefined ? { datum: dto.datum } : {}),
        ...(dto.pruefungsart !== undefined ? { pruefungsart: dto.pruefungsart } : {}),
        ...(dto.gewichtung !== undefined ? { gewichtung: dto.gewichtung } : {}),
        ...(dto.zeugnisUrl !== undefined ? { zeugnisUrl: dto.zeugnisUrl } : {}),
      },
    });
    return this.toResponse(updated);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    const entry = await this.prisma.gradeEntry.findUnique({ where: { id } });
    if (!entry) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.GRADE_NOT_FOUND,
        message: `GradeEntry ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, entry.azubiId);
    await this.prisma.gradeEntry.delete({ where: { id } });
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

  private toResponse(e: {
    id: string;
    azubiId: string;
    fach: string;
    halbjahr: string | null;
    note: number;
    datum: Date | null;
    pruefungsart: string | null;
    gewichtung: number | null;
    zeugnisUrl: string | null;
    createdAt: Date;
  }): GradeEntryResponseDto {
    return {
      id: e.id,
      azubiId: e.azubiId,
      fach: e.fach,
      halbjahr: e.halbjahr,
      note: e.note,
      datum: e.datum,
      pruefungsart: e.pruefungsart,
      gewichtung: e.gewichtung ?? 1.0,
      zeugnisUrl: e.zeugnisUrl,
      createdAt: e.createdAt,
    };
  }
}
