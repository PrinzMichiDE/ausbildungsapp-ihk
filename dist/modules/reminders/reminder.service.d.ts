import { PrismaService } from '../../database/prisma.service.js';
import { TeamsNotificationService } from '../../shared/notifications/teams-notification.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
export declare class ReminderService {
    private readonly prisma;
    private readonly teams;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, teams: TeamsNotificationService, notifications: NotificationsService);
    sendFridayReminders(): Promise<void>;
    sendReviewReminders(): Promise<void>;
    private getIsoWeek;
}
