var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Patch, Put, Query, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationPreferenceResponseDto, NotificationResponseDto, UnreadCountDto, UpdateNotificationPreferencesDto, } from './dto/notification.dto.js';
let NotificationsController = class NotificationsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(user, query) {
        return this.service.findAll(user, query);
    }
    unreadCount(user) {
        return this.service.unreadCount(user).then((count) => ({ count }));
    }
    markAllRead(user) {
        return this.service.markAllRead(user);
    }
    markRead(id, user) {
        return this.service.markRead(id, user);
    }
    markAcknowledged(id, user) {
        return this.service.markAcknowledged(id, user);
    }
    getPreferences(user) {
        return this.service.getPreferences(user);
    }
    updatePreferences(user, dto) {
        return this.service.updatePreferences(user, dto);
    }
};
__decorate([
    ApiOperation({ summary: 'Listet eigene Benachrichtigungen' }),
    ApiResponse({ status: 200, type: [NotificationResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Zählt ungelesene Benachrichtigungen' }),
    ApiResponse({ status: 200, type: UnreadCountDto }),
    Get('unread-count'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unreadCount", null);
__decorate([
    ApiOperation({ summary: 'Markiert alle eigenen Benachrichtigungen als gelesen' }),
    ApiResponse({ status: 200 }),
    Patch('read-all'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllRead", null);
__decorate([
    ApiOperation({ summary: 'Markiert eine Benachrichtigung als gelesen' }),
    ApiResponse({ status: 200, type: NotificationResponseDto }),
    Patch(':id/read'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markRead", null);
__decorate([
    ApiOperation({ summary: 'Quittiert eine Benachrichtigung (z.B. Freigabe)' }),
    ApiResponse({ status: 200, type: NotificationResponseDto }),
    Patch(':id/acknowledge'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAcknowledged", null);
__decorate([
    ApiOperation({ summary: 'Liefert die Benachrichtigungskanäle des Nutzers' }),
    ApiResponse({ status: 200, type: [NotificationPreferenceResponseDto] }),
    Get('preferences'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getPreferences", null);
__decorate([
    ApiOperation({ summary: 'Speichert die Benachrichtigungskanäle des Nutzers' }),
    ApiResponse({ status: 200, type: [NotificationPreferenceResponseDto] }),
    Put('preferences'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateNotificationPreferencesDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updatePreferences", null);
NotificationsController = __decorate([
    ApiTags('notifications'),
    ApiBearerAuth(),
    Controller({ path: 'notifications', version: '1' }),
    __metadata("design:paramtypes", [NotificationsService])
], NotificationsController);
export { NotificationsController };
//# sourceMappingURL=notifications.controller.js.map