import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { TeamsNotificationService } from '../../shared/notifications/teams-notification.service.js';
import { CreateNotificationInput, NotificationPreferenceResponseDto, NotificationResponseDto, UpdateNotificationPreferencesDto } from './dto/notification.dto.js';
export declare class NotificationsService {
    private readonly prisma;
    private readonly teams;
    private readonly logger;
    constructor(prisma: PrismaService, teams: TeamsNotificationService);
    create(input: CreateNotificationInput): Promise<void>;
    findAll(currentUser: CurrentUser, query: PaginationQueryDto): Promise<{
        items: readonly NotificationResponseDto[];
        meta: import("../../common/dto/pagination-query.dto.js").PaginationMeta;
    }>;
    unreadCount(currentUser: CurrentUser): Promise<number>;
    markRead(id: string, currentUser: CurrentUser): Promise<NotificationResponseDto>;
    markAllRead(currentUser: CurrentUser): Promise<{
        count: number;
    }>;
    markAcknowledged(id: string, currentUser: CurrentUser): Promise<NotificationResponseDto>;
    getPreferences(currentUser: CurrentUser): Promise<NotificationPreferenceResponseDto[]>;
    updatePreferences(currentUser: CurrentUser, dto: UpdateNotificationPreferencesDto): Promise<NotificationPreferenceResponseDto[]>;
    private getPreference;
    private loadOwned;
    private toResponse;
}
