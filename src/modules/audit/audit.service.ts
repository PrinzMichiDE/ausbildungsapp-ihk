import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { AuditResponseDto } from './dto/audit.dto.js';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(currentUser: CurrentUser): Promise<AuditResponseDto[]> {
    if (!this.canManage(currentUser)) {
      const where = { userId: currentUser.id };
      const items = await this.prisma.auditEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
      return items.map((e) => this.toResponse(e));
    }
    const items = await this.prisma.auditEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return items.map((e) => this.toResponse(e));
  }

  async findOne(id: string, currentUser: CurrentUser): Promise<AuditResponseDto> {
    const event = await this.prisma.auditEvent.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.AUDIT_EVENT_NOT_FOUND,
        message: `Audit-Event ${id} nicht gefunden`,
      });
    }
    if (
      !this.canManage(currentUser) &&
      event.userId !== currentUser.id
    ) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Zugriff auf dieses Audit-Event',
      });
    }
    return this.toResponse(event);
  }

  async create(currentUser: CurrentUser, dto: {
    action: string;
    entity?: string;
    entityId?: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditResponseDto> {
    const event = await this.prisma.auditEvent.create({
      data: {
        userId: currentUser.id,
        action: dto.action,
        entity: dto.entity ?? null,
        entityId: dto.entityId ?? null,
        details: dto.details ?? null,
        ipAddress: dto.ipAddress ?? null,
        userAgent: dto.userAgent ?? null,
      },
    });
    return this.toResponse(event);
  }

  private canManage(user: CurrentUser): boolean {
    return user.roles.some(
      (r) => r === Role.ausbilder || r === Role.hr || r === Role.admin,
    );
  }

  private toResponse(e: {
    id: string;
    userId: string;
    action: string;
    entity: string | null;
    entityId: string | null;
    details: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }): AuditResponseDto {
    return {
      id: e.id,
      userId: e.userId,
      action: e.action,
      entity: e.entity,
      entityId: e.entityId,
      details: e.details,
      ipAddress: e.ipAddress,
      userAgent: e.userAgent,
      createdAt: e.createdAt,
    };
  }
}