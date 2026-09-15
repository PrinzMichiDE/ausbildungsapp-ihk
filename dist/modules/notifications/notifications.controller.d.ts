import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationPreferenceResponseDto, NotificationResponseDto, UnreadCountDto, UpdateNotificationPreferencesDto } from './dto/notification.dto.js';
export declare class NotificationsController {
    private readonly service;
    constructor(service: NotificationsService);
    findAll(user: CurrentUser, query: PaginationQueryDto): Promise<{
        items: readonly NotificationResponseDto[];
        meta: import("../../common/dto/pagination-query.dto.js").PaginationMeta;
    }>;
    unreadCount(user: CurrentUser): Promise<UnreadCountDto>;
    markAllRead(user: CurrentUser): Promise<{
        count: number;
    }>;
    markRead(id: string, user: CurrentUser): Promise<NotificationResponseDto>;
    markAcknowledged(id: string, user: CurrentUser): Promise<NotificationResponseDto>;
    getPreferences(user: CurrentUser): Promise<NotificationPreferenceResponseDto[]>;
    updatePreferences(user: CurrentUser, dto: UpdateNotificationPreferencesDto): Promise<NotificationPreferenceResponseDto[]>;
}
