var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
import { ForbiddenException, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { NotificationPriority, } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { withPagination } from '../../common/dto/pagination-query.dto.js';
import { TeamsNotificationService } from '../../shared/notifications/teams-notification.service.js';
import { defaultPreferences, describeCategory, } from './dto/notification.dto.js';
let NotificationsService = NotificationsService_1 = class NotificationsService {
    prisma;
    teams;
    logger = new Logger(NotificationsService_1.name);
    constructor(prisma, teams) {
        this.prisma = prisma;
        this.teams = teams;
    }
    async create(input) {
        const preference = await this.getPreference(input.userId, input.category);
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
            await this.teams.send(input.title, input.message, { Kategorie: describeCategory(input.category) });
        }
        if (preference.email) {
            this.logger.debug(`[email] to=${input.userId} subject=${input.title}`);
        }
    }
    async findAll(currentUser, query) {
        const [items, total] = await this.prisma.$transaction([
            this.prisma.notification.findMany({
                where: { userId: currentUser.id },
                orderBy: { createdAt: 'desc' },
                skip: (query.page - 1) * query.limit,
                take: query.limit,
            }),
            this.prisma.notification.count({ where: { userId: currentUser.id } }),
        ]);
        return withPagination(items.map((n) => this.toResponse(n)), query.page, query.limit, total);
    }
    async unreadCount(currentUser) {
        return this.prisma.notification.count({
            where: { userId: currentUser.id, readAt: null },
        });
    }
    async markRead(id, currentUser) {
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
    async markAllRead(currentUser) {
        const result = await this.prisma.notification.updateMany({
            where: { userId: currentUser.id, readAt: null },
            data: { readAt: new Date() },
        });
        return { count: result.count };
    }
    async markAcknowledged(id, currentUser) {
        const notification = await this.loadOwned(id, currentUser);
        const now = new Date();
        const updated = await this.prisma.notification.update({
            where: { id },
            data: { readAt: notification.readAt ?? now, acknowledgedAt: now },
        });
        return this.toResponse(updated);
    }
    async getPreferences(currentUser) {
        const stored = await this.prisma.notificationPreference.findMany({
            where: { userId: currentUser.id },
        });
        const storedByCategory = new Map(stored.map((p) => [p.category, p]));
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
    async updatePreferences(currentUser, dto) {
        const data = dto.preferences.map((p) => ({ ...p, userId: currentUser.id }));
        await this.prisma.$transaction(data.map((p) => this.prisma.notificationPreference.upsert({
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
        })));
        return this.getPreferences(currentUser);
    }
    async getPreference(userId, category) {
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
    async loadOwned(id, currentUser) {
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
    toResponse(notification) {
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
};
NotificationsService = NotificationsService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        TeamsNotificationService])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map