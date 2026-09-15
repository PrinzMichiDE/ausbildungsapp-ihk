var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationCategory, NotificationPriority } from '@prisma/client';
export class NotificationResponseDto {
    id;
    userId;
    category;
    title;
    message;
    priority;
    readAt;
    acknowledgedAt;
    referenceType;
    referenceId;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ enum: NotificationCategory }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "category", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "title", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "message", void 0);
__decorate([
    ApiProperty({ enum: NotificationPriority }),
    __metadata("design:type", String)
], NotificationResponseDto.prototype, "priority", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "readAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "acknowledgedAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "referenceType", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], NotificationResponseDto.prototype, "referenceId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], NotificationResponseDto.prototype, "createdAt", void 0);
export class NotificationPreferenceItemDto {
    category;
    inApp;
    email;
    teams;
}
__decorate([
    ApiProperty({ enum: NotificationCategory }),
    IsEnum(NotificationCategory),
    __metadata("design:type", String)
], NotificationPreferenceItemDto.prototype, "category", void 0);
__decorate([
    ApiProperty({ default: true }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], NotificationPreferenceItemDto.prototype, "inApp", void 0);
__decorate([
    ApiProperty({ default: false }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], NotificationPreferenceItemDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ default: false }),
    IsBoolean(),
    __metadata("design:type", Boolean)
], NotificationPreferenceItemDto.prototype, "teams", void 0);
export class UpdateNotificationPreferencesDto {
    preferences;
}
__decorate([
    ApiProperty({ type: [NotificationPreferenceItemDto] }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => NotificationPreferenceItemDto),
    __metadata("design:type", Array)
], UpdateNotificationPreferencesDto.prototype, "preferences", void 0);
export class NotificationPreferenceResponseDto {
    category;
    inApp;
    email;
    teams;
}
__decorate([
    ApiProperty({ enum: NotificationCategory }),
    __metadata("design:type", String)
], NotificationPreferenceResponseDto.prototype, "category", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], NotificationPreferenceResponseDto.prototype, "inApp", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], NotificationPreferenceResponseDto.prototype, "email", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], NotificationPreferenceResponseDto.prototype, "teams", void 0);
export class UnreadCountDto {
    count;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], UnreadCountDto.prototype, "count", void 0);
export class AcknowledgeResponseDto {
    ok;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], AcknowledgeResponseDto.prototype, "ok", void 0);
export const DEFAULT_PREFERENCES = [
    {
        category: NotificationCategory.review,
        inApp: true,
        email: false,
        teams: false,
    },
    {
        category: NotificationCategory.deadline,
        inApp: true,
        email: true,
        teams: false,
    },
    {
        category: NotificationCategory.reminder,
        inApp: true,
        email: true,
        teams: false,
    },
    {
        category: NotificationCategory.absence,
        inApp: true,
        email: false,
        teams: false,
    },
    {
        category: NotificationCategory.system,
        inApp: true,
        email: false,
        teams: false,
    },
];
export function defaultPreferences() {
    return DEFAULT_PREFERENCES.map((p) => ({ ...p }));
}
export function isKnownCategory(category) {
    return Object.values(NotificationCategory).includes(category);
}
export function describeCategory(category) {
    const labels = {
        [NotificationCategory.review]: 'Freigaben',
        [NotificationCategory.deadline]: 'Fristen',
        [NotificationCategory.reminder]: 'Erinnerungen',
        [NotificationCategory.absence]: 'Abwesenheiten',
        [NotificationCategory.system]: 'System',
    };
    return labels[category];
}
//# sourceMappingURL=notification.dto.js.map