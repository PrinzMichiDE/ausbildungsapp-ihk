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
  ChecklistResponseDto,
  CreateChecklistDto,
  UpdateChecklistItemDto,
} from './dto/checklist.dto.js';

@Injectable()
export class OnboardingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async create(
    currentUser: CurrentUser,
    dto: CreateChecklistDto,
  ): Promise<ChecklistResponseDto> {
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/Admin dürfen Checklisten anlegen',
      });
    }
    const azubiId = dto.azubiId ?? currentUser.azubiId;
    if (!azubiId) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.BAD_REQUEST,
        message: 'azubiId ist erforderlich',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);

    const checklist = await this.prisma.checklist.create({
      data: {
        azubiId,
        titel: dto.titel,
        items: {
          create: dto.items.map((text, index) => ({
            text,
            reihenfolge: index,
          })),
        },
      },
      include: { items: true },
    });
    return this.toResponse(checklist);
  }

  async findAll(currentUser: CurrentUser): Promise<ChecklistResponseDto[]> {
    const where = await this.scopeWhere(currentUser);
    const items = await this.prisma.checklist.findMany({
      where,
      include: { items: { orderBy: { reihenfolge: 'asc' } } },
    });
    return items.map((c) => this.toResponse(c));
  }

  async findOne(
    id: string,
    currentUser: CurrentUser,
  ): Promise<ChecklistResponseDto> {
    const checklist = await this.prisma.checklist.findUnique({
      where: { id },
      include: { items: { orderBy: { reihenfolge: 'asc' } } },
    });
    if (!checklist) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
        message: `Checkliste ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, checklist.azubiId);
    return this.toResponse(checklist);
  }

  async updateItem(
    id: string,
    itemId: string,
    currentUser: CurrentUser,
    dto: UpdateChecklistItemDto,
  ): Promise<ChecklistResponseDto> {
    const checklist = await this.prisma.checklist.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!checklist) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
        message: `Checkliste ${id} nicht gefunden`,
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, checklist.azubiId);

    const isOwner =
      currentUser.roles.includes(Role.azubi) &&
      checklist.azubiId === currentUser.azubiId;
    if (!isOwner && !this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Keine Berechtigung',
      });
    }

    const item = checklist.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
        message: `Item ${itemId} nicht gefunden`,
      });
    }

    await this.prisma.checklistItem.update({
      where: { id: itemId },
      data: { erledigt: dto.erledigt },
    });

    return this.findOne(id, currentUser);
  }

  async remove(id: string, currentUser: CurrentUser): Promise<void> {
    if (!this.canManage(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/Admin dürfen Checklisten löschen',
      });
    }
    const checklist = await this.prisma.checklist.findUnique({ where: { id } });
    if (!checklist) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.CHECKLIST_NOT_FOUND,
        message: `Checkliste ${id} nicht gefunden`,
      });
    }
    await this.prisma.checklist.delete({ where: { id } });
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
      (r) => r === Role.ausbilder || r === Role.admin,
    );
  }

  private toResponse(c: {
    id: string;
    azubiId: string;
    titel: string;
    items: Array<{ id: string; text: string; erledigt: boolean; reihenfolge: number }>;
  }): ChecklistResponseDto {
    const allDone = c.items.length > 0 && c.items.every((i) => i.erledigt);
    return {
      id: c.id,
      azubiId: c.azubiId,
      titel: c.titel,
      erledigt: allDone,
      items: c.items.map((i) => ({
        id: i.id,
        text: i.text,
        erledigt: i.erledigt,
        reihenfolge: i.reihenfolge,
      })),
    };
  }
}
