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
import { Body, Controller, Delete, Get, Param, Patch, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { OnboardingService } from './onboarding.service.js';
import { ChecklistResponseDto, CreateChecklistDto, UpdateChecklistItemDto, } from './dto/checklist.dto.js';
let OnboardingController = class OnboardingController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(user, dto) {
        return this.service.create(user, dto);
    }
    findAll(user) {
        return this.service.findAll(user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    updateItem(id, itemId, user, dto) {
        return this.service.updateItem(id, itemId, user, dto);
    }
    async remove(id, user) {
        await this.service.remove(id, user);
    }
};
__decorate([
    ApiOperation({ summary: 'Legt eine Onboarding-Checkliste an (Ausbilder/Admin)' }),
    ApiResponse({ status: 201, type: ChecklistResponseDto }),
    Roles(Role.ausbilder, Role.admin),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateChecklistDto]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Checklisten (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [ChecklistResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Checkliste' }),
    ApiResponse({ status: 200, type: ChecklistResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Setzt den Erledigt-Status eines Items' }),
    ApiResponse({ status: 200, type: ChecklistResponseDto }),
    Patch(':id/items/:itemId'),
    __param(0, Param('id')),
    __param(1, Param('itemId')),
    __param(2, CurrentUser()),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, UpdateChecklistItemDto]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "updateItem", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Checkliste (Ausbilder/Admin)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.ausbilder, Role.admin),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OnboardingController.prototype, "remove", null);
OnboardingController = __decorate([
    ApiTags('onboarding'),
    ApiBearerAuth(),
    Controller({ path: 'onboarding/checklisten', version: '1' }),
    __metadata("design:paramtypes", [OnboardingService])
], OnboardingController);
export { OnboardingController };
//# sourceMappingURL=onboarding.controller.js.map