import { NotificationCategory, NotificationPriority } from '@prisma/client';
export declare class NotificationResponseDto {
    id: string;
    userId: string;
    category: NotificationCategory;
    title: string;
    message: string;
    priority: NotificationPriority;
    readAt: Date | null;
    acknowledgedAt: Date | null;
    referenceType: string | null;
    referenceId: string | null;
    createdAt: Date;
}
export declare class NotificationPreferenceItemDto {
    category: NotificationCategory;
    inApp: boolean;
    email: boolean;
    teams: boolean;
}
export declare class UpdateNotificationPreferencesDto {
    preferences: NotificationPreferenceItemDto[];
}
export declare class NotificationPreferenceResponseDto {
    category: NotificationCategory;
    inApp: boolean;
    email: boolean;
    teams: boolean;
}
export declare class UnreadCountDto {
    count: number;
}
export declare class AcknowledgeResponseDto {
    ok: boolean;
}
export interface CreateNotificationInput {
    userId: string;
    category: NotificationCategory;
    title: string;
    message: string;
    priority?: NotificationPriority;
    referenceType?: string;
    referenceId?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare const DEFAULT_PREFERENCES: ReadonlyArray<NotificationPreferenceResponseDto>;
export declare function defaultPreferences(): NotificationPreferenceResponseDto[];
export declare function isKnownCategory(category: NotificationCategory): boolean;
export declare function describeCategory(category: NotificationCategory): string;
