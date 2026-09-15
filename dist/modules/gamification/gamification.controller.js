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
import { Body, Controller, Get, Param, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { GamificationService } from './gamification.service.js';
import { BadgeResponseDto, CreateBadgeDto, UserBadgeResponseDto, } from './dto/badge.dto.js';
let GamificationController = class GamificationController {
    service;
    constructor(service) {
        this.service = service;
    }
    createBadge(dto) {
        return this.service.createBadge(dto);
    }
    listBadges() {
        return this.service.listBadges();
    }
    listUserBadges(azubiId, user) {
        return this.service.listUserBadges(user, azubiId);
    }
    award(azubiId, schluessel, user) {
        return this.service.awardBadge(user, azubiId, schluessel);
    }
};
__decorate([
    ApiOperation({ summary: 'Legt eine Badge-Definition an (Admin)' }),
    ApiResponse({ status: 201, type: BadgeResponseDto }),
    Roles(Role.admin),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateBadgeDto]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "createBadge", null);
__decorate([
    ApiOperation({ summary: 'Listet alle Badge-Definitionen' }),
    ApiResponse({ status: 200, type: [BadgeResponseDto] }),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "listBadges", null);
__decorate([
    ApiOperation({ summary: 'Listet vergebene Badges eines Azubis' }),
    ApiResponse({ status: 200, type: [UserBadgeResponseDto] }),
    Get('user/:azubiId'),
    __param(0, Param('azubiId')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "listUserBadges", null);
__decorate([
    ApiOperation({ summary: 'Verleiht ein Badge (Ausbilder/Admin)' }),
    ApiResponse({ status: 201, type: UserBadgeResponseDto }),
    Roles(Role.ausbilder, Role.admin),
    Post(':azubiId/:schluessel'),
    __param(0, Param('azubiId')),
    __param(1, Param('schluessel')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "award", null);
GamificationController = __decorate([
    ApiTags('gamification'),
    ApiBearerAuth(),
    Controller({ path: 'badges', version: '1' }),
    __metadata("design:paramtypes", [GamificationService])
], GamificationController);
export { GamificationController };
//# sourceMappingURL=gamification.controller.js.map