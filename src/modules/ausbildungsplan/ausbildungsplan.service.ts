import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateAusbildungsplanDto, UpdateAusbildungsplanDto, AusbildungsplanResponseDto } from './dto/ausbildungsplan.dto.js';
import { AusbildungsplanStatus, Ausbildungsberuf, Prisma } from '@prisma/client';

@Injectable()
export class AusbildungsplanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
    private readonly auditService: AuditService,
  ) {}

  async create(user: CurrentUser, dto: CreateAusbildungsplanDto): Promise<AusbildungsplanResponseDto> {
    if (!user.roles.some(r => r === Role.ausbilder || r === Role.admin)) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Erstellen' });
    }
    const plan = await this.prisma.ausbildungsplan.create({
      data: {
        azubiId: user.azubiId ?? '',
        ausbilderId: user.id,
        beruf: dto.beruf,
        jahr: dto.jahr,
        inhalte: dto.inhalte ?? Prisma.DbNull,
        status: AusbildungsplanStatus.entwurf,
        anhangUrl: dto.anhangUrl ?? null,
      },
    });
    await this.auditService.create(user, { action: 'CREATE', entity: 'Ausbildungsplan', entityId: plan.id, details: `Neuer Ausbildungsplan erstellt für ${dto.beruf} ${dto.jahr}` });
    return this.toResponse(plan);
  }

  async findAll(user: CurrentUser): Promise<AusbildungsplanResponseDto[]> {
    const isAzubi = user.roles.includes(Role.azubi);
    const isAusbilderOrHr = user.roles.includes(Role.ausbilder) || user.roles.includes(Role.hr);
    const isAdmin = user.roles.includes(Role.admin);

    if (isAdmin) {
      const plans = await this.prisma.ausbildungsplan.findMany();
      return plans.map(p => this.toResponse(p));
    }

    const visibleAzubiIds = await this.scope.getVisibleAzubiIds(user);
    let where: any = {};

    if (isAzubi) {
      where.azubiId = user.azubiId;
    } else if (Array.isArray(visibleAzubiIds)) {
      where.azubiId = { in: visibleAzubiIds };
    } else if (isAusbilderOrHr) {
      where.azubiId = { not: null };
    } else {
      where.id = null;
    }

    const plans = await this.prisma.ausbildungsplan.findMany({ where });
    return plans.map(p => this.toResponse(p));
  }

  async findOne(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto> {
    const plan = await this.prisma.ausbildungsplan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: `Ausbildungsplan ${id} nicht gefunden` });
    }
    await this.assertScopedAccess(user, plan);
    return this.toResponse(plan);
  }

  async update(user: CurrentUser, id: string, dto: UpdateAusbildungsplanDto): Promise<AusbildungsplanResponseDto> {
    const plan = await this.findOne(user, id);
    const isOwner = plan.azubiId === user.azubiId;
    const isAusbilderOrAdmin = user.roles.some(r => r === Role.ausbilder || r === Role.admin);
    if (!isOwner && !isAusbilderOrAdmin) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Aktualisieren' });
    }
    const updated = await this.prisma.ausbildungsplan.update({
      where: { id },
      data: {
        beruf: dto.beruf,
        jahr: dto.jahr,
        inhalte: dto.inhalte,
        anhangUrl: dto.anhangUrl,
      },
    });
    await this.auditService.create(user, { action: 'UPDATE', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} aktualisiert` });
    return this.toResponse(updated);
  }

  async remove(user: CurrentUser, id: string): Promise<void> {
    const plan = await this.findOne(user, id);
    const isOwner = plan.azubiId === user.azubiId;
    const isAdmin = user.roles.includes(Role.admin);
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Keine Berechtigung zum Löschen' });
    }
    await this.prisma.ausbildungsplan.delete({ where: { id } });
    await this.auditService.create(user, { action: 'DELETE', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} gelöscht` });
  }

  async submit(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto> {
    const plan = await this.findOne(user, id);
    if (plan.status !== AusbildungsplanStatus.entwurf) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur Entwürfe können eingereicht werden' });
    }
    const updated = await this.prisma.ausbildungsplan.update({
      where: { id },
      data: { status: AusbildungsplanStatus.eingereicht },
    });
    await this.auditService.create(user, { action: 'SUBMIT', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} eingereicht` });
    return this.toResponse(updated);
  }

  async review(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto> {
    const plan = await this.findOne(user, id);
    if (plan.status !== AusbildungsplanStatus.eingereicht) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur eingereichte Pläne können geprüft werden' });
    }
    const updated = await this.prisma.ausbildungsplan.update({
      where: { id },
      data: { status: AusbildungsplanStatus.geprueft, geprueftVon: user.id, geprueftAm: new Date() },
    });
    await this.auditService.create(user, { action: 'REVIEW', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} geprüft` });
    return this.toResponse(updated);
  }

  async approve(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto> {
    const plan = await this.findOne(user, id);
    if (plan.status !== AusbildungsplanStatus.geprueft) {
      throw new ForbiddenException({ errorCode: ERROR_CODES.BAD_REQUEST, message: 'Nur geprüfte Pläne können genehmigt werden' });
    }
    const updated = await this.prisma.ausbildungsplan.update({
      where: { id },
      data: { status: AusbildungsplanStatus.genehmigt },
    });
    await this.auditService.create(user, { action: 'APPROVE', entity: 'Ausbildungsplan', entityId: id, details: `Ausbildungsplan ${id} genehmigt` });
    return this.toResponse(updated);
  }

  async getRahmenlehrplan(user: CurrentUser, id: string): Promise<Record<string, any>> {
    const plan = await this.findOne(user, id);
    const frameworks = await this.prisma.framework.findMany({
      where: { titel: plan.beruf },
    });
    await this.auditService.create(user, { action: 'VIEW_RAHMENLEHRPLAN', entity: 'Ausbildungsplan', entityId: id, details: `Rahmenlehrplan für Ausbildungsplan ${id} abgerufen` });
    return { beruf: plan.beruf, jahr: plan.jahr, frameworks };
  }

  private async assertScopedAccess(user: CurrentUser, plan: { azubiId: string; ausbilderId: string; status: AusbildungsplanStatus }): Promise<void> {
    const isOwner = plan.azubiId === user.azubiId;
    const isAusbilderOrAdmin = user.roles.some(r => r === Role.ausbilder || r === Role.admin);
    const isAusbildungsbeauftragter = user.roles.includes(Role.ausbildungsbeauftragter);
    const isHr = user.roles.includes(Role.hr);

    if (isOwner || isAusbilderOrAdmin || isHr) return;

    if (isAusbildungsbeauftragter) {
      const visibleIds = await this.scope.getVisibleAzubiIds(user);
      if (visibleIds === 'ALL' || (Array.isArray(visibleIds) && visibleIds.includes(plan.azubiId))) return;
    }

    throw new ForbiddenException({ errorCode: ERROR_CODES.ACCESS_DENIED, message: 'Kein Zugriff auf diesen Ausbildungsplan' });
  }

  private toResponse(plan: {
    id: string; azubiId: string; ausbilderId: string; beruf: string; jahr: number;
    inhalte: any; status: AusbildungsplanStatus; anhangUrl: string | null;
    gueltigVon: Date | null; gueltigBis: Date | null; geprueftVon: string | null;
    geprueftAm: Date | null; createdAt: Date; updatedAt: Date;
  }): AusbildungsplanResponseDto {
    return {
      id: plan.id, azubiId: plan.azubiId, ausbilderId: plan.ausbilderId,
      beruf: plan.beruf as Ausbildungsberuf, jahr: plan.jahr,
      inhalte: plan.inhalte ?? undefined, status: plan.status,
      anhangUrl: plan.anhangUrl ?? undefined,
      gueltigVon: plan.gueltigVon ?? undefined,
      gueltigBis: plan.gueltigBis ?? undefined,
      geprueftVon: plan.geprueftVon ?? undefined,
      geprueftAm: plan.geprueftAm ?? undefined,
      createdAt: plan.createdAt, updatedAt: plan.updatedAt,
    };
  }
}
