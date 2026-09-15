import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Notification,
  NotificationCategory,
  NotificationPriority,
} from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { withPagination } from '../../common/dto/pagination-query.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { TeamsNotificationService } from '../../shared/notifications/teams-notification.service.js';
import {
  CreateNotificationInput,
  NotificationPreferenceItemDto,
  NotificationPreferenceResponseDto,
  NotificationResponseDto,
  UpdateNotificationPreferencesDto,
  defaultPreferences,
  describeCategory,
} from './dto/notification.dto.js';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly teams: TeamsNotificationService,
  ) {}

  async create(input: CreateNotificationInput): Promise<void> {
    const preference = await this.getPreference(
      input.userId,
      input.category,
    );

    if (preference.inApp) {
      await this.prisma.notification.create({
        data: {
          userId: input.userId,
          category: input.category,
          title: input.title,
          message: input.message,
          priority: input.priority ?? NotificationPriority.medium,
          referenceType: input.referenceType ?? null,
          referenceId: input.referenceId ?? null,
        },
      });
    }

    if (preference.teams) {
      await this.teams.send(
        input.title,
        input.message,
        { Kategorie: describeCategory(input.category) },
      );
    }

    if (preference.email) {
      // Email delivery is not wired to an SMTP transport yet (outbox planned).
      this.logger.debug(
        `[email] to=${input.userId} subject=${input.title}`,
      );
    }
  }

  async findAll(currentUser: CurrentUser, query: PaginationQueryDto) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId: currentUser.id },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.notification.count({ where: { userId: currentUser.id } }),
    ]);
    return withPagination(
      items.map((n) => this.toResponse(n)),
      query.page,
      query.limit,
      total,
    );
  }

  async unreadCount(currentUser: CurrentUser): Promise<number> {
    return this.prisma.notification.count({
      where: { userId: currentUser.id, readAt: null },
    });
  }

  async markRead(
    id: string,
    currentUser: CurrentUser,
  ): Promise<NotificationResponseDto> {
    const notification = await this.loadOwned(id, currentUser);
    if (notification.readAt) {
      return this.toResponse(notification);
    }
    const updated = await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
    return this.toResponse(updated);
  }

  async markAllRead(currentUser: CurrentUser): Promise<{ count: number }> {
    const result = await this.prisma.notification.updateMany({
      where: { userId: currentUser.id, readAt: null },
      data: { readAt: new Date() },
    });
    return { count: result.count };
  }

  async markAcknowledged(
    id: string,
    currentUser: CurrentUser,
  ): Promise<NotificationResponseDto> {
    const notification = await this.loadOwned(id, currentUser);
    const now = new Date();
    const updated = await this.prisma.notification.update({
      where: { id },
      data: { readAt: notification.readAt ?? now, acknowledgedAt: now },
    });
    return this.toResponse(updated);
  }

  async getPreferences(
    currentUser: CurrentUser,
  ): Promise<NotificationPreferenceResponseDto[]> {
    const stored = await this.prisma.notificationPreference.findMany({
      where: { userId: currentUser.id },
    });
    const storedByCategory = new Map(
      stored.map((p) => [p.category, p]),
    );
    return defaultPreferences().map((def) => {
      const row = storedByCategory.get(def.category);
      if (!row) {
        return def;
      }
      return {
        category: row.category,
        inApp: row.inApp,
        email: row.email,
        teams: row.teams,
      };
    });
  }

  async updatePreferences(
    currentUser: CurrentUser,
    dto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferenceResponseDto[]> {
    const data: Array<NotificationPreferenceItemDto & { userId: string }> =
      dto.preferences.map((p) => ({ ...p, userId: currentUser.id }));

    await this.prisma.$transaction(
      data.map((p) =>
        this.prisma.notificationPreference.upsert({
          where: {
            userId_category: { userId: p.userId, category: p.category },
          },
          update: { inApp: p.inApp, email: p.email, teams: p.teams },
          create: {
            userId: p.userId,
            category: p.category,
            inApp: p.inApp,
            email: p.email,
            teams: p.teams,
          },
        }),
      ),
    );

    return this.getPreferences(currentUser);
  }

  private async getPreference(
    userId: string,
    category: NotificationCategory,
  ): Promise<NotificationPreferenceResponseDto> {
    const stored = await this.prisma.notificationPreference.findUnique({
      where: { userId_category: { userId, category } },
    });
    if (stored) {
      return {
        category: stored.category,
        inApp: stored.inApp,
        email: stored.email,
        teams: stored.teams,
      };
    }
    const def = defaultPreferences().find((p) => p.category === category);
    return def ?? { category, inApp: true, email: false, teams: false };
  }

  private async loadOwned(
    id: string,
    currentUser: CurrentUser,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.NOTIFICATION_NOT_FOUND,
        message: `Benachrichtigung ${id} nicht gefunden`,
      });
    }
    if (notification.userId !== currentUser.id) {
      throw new ForbiddenException({
        errorCode: ERROR_CODES.ACCESS_DENIED,
        message: 'Kein Zugriff auf diese Benachrichtigung',
      });
    }
    return notification;
  }

  private toResponse(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      userId: notification.userId,
      category: notification.category,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      readAt: notification.readAt,
      acknowledgedAt: notification.acknowledgedAt,
      referenceType: notification.referenceType,
      referenceId: notification.referenceId,
      createdAt: notification.createdAt,
    };
  }
}