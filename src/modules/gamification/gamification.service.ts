import {
  ConflictException,
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
  BadgeResponseDto,
  CreateBadgeDto,
  UserBadgeResponseDto,
} from './dto/badge.dto.js';

@Injectable()
export class GamificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scope: AccessScopeService,
  ) {}

  async createBadge(dto: CreateBadgeDto): Promise<BadgeResponseDto> {
    const badge = await this.prisma.badge.create({ data: dto });
    return this.toBadge(badge);
  }

  async listBadges(): Promise<BadgeResponseDto[]> {
    const badges = await this.prisma.badge.findMany({ orderBy: { titel: 'asc' } });
    return badges.map((b) => this.toBadge(b));
  }

  async listUserBadges(
    currentUser: CurrentUser,
    azubiId?: string,
  ): Promise<UserBadgeResponseDto[]> {
    const target = await this.resolveTarget(currentUser, azubiId);
    const userBadges = await this.prisma.userBadge.findMany({
      where: { azubiId: target },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' },
    });
    return userBadges.map((ub) => this.toUserBadge(ub));
  }

  async awardBadge(
    currentUser: CurrentUser,
    azubiId: string,
    schluessel: string,
  ): Promise<UserBadgeResponseDto> {
    if (!this.canAward(currentUser)) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Nur Ausbilder/Admin dürfen Badges vergeben',
      });
    }
    await this.scope.assertCanAccessAzubi(currentUser, azubiId);

    const badge = await this.prisma.badge.findUnique({
      where: { schluessel },
    });
    if (!badge) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.BADGE_NOT_FOUND,
        message: `Badge ${schluessel} nicht gefunden`,
      });
    }

    const existing = await this.prisma.userBadge.findUnique({
      where: { azubiId_badgeId: { azubiId, badgeId: badge.id } },
    });
    if (existing) {
      throw new ConflictException({
        errorCode: ERROR_CODES.CONFLICT,
        message: 'Badge bereits vergeben',
      });
    }

    const userBadge = await this.prisma.userBadge.create({
      data: { azubiId, badgeId: badge.id },
      include: { badge: true },
    });
    return this.toUserBadge(userBadge);
  }

  private async resolveTarget(
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
          message: 'Azubis sehen nur eigene Badges',
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

  private canAward(user: CurrentUser): boolean {
    return user.roles.some(
      (r) => r === Role.ausbilder || r === Role.admin,
    );
  }

  private toBadge(b: {
    id: string;
    schluessel: string;
    titel: string;
    beschreibung: string | null;
    icon: string | null;
  }): BadgeResponseDto {
    return {
      id: b.id,
      schluessel: b.schluessel,
      titel: b.titel,
      beschreibung: b.beschreibung,
      icon: b.icon,
    };
  }

  private toUserBadge(ub: {
    id: string;
    azubiId: string;
    earnedAt: Date;
    badge: {
      id: string;
      schluessel: string;
      titel: string;
      beschreibung: string | null;
      icon: string | null;
    };
  }): UserBadgeResponseDto {
    return {
      id: ub.id,
      azubiId: ub.azubiId,
      earnedAt: ub.earnedAt,
      badge: this.toBadge(ub.badge),
    };
  }
}
