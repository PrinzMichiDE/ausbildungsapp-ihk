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
import { AuditService } from './audit.service.js';
import { AuditResponseDto } from './dto/audit.dto.js';
let AuditController = class AuditController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(user) {
        return this.service.findAll(user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    create(user, body) {
        return this.service.create(user, body);
    }
};
__decorate([
    ApiOperation({ summary: 'Listet Audit-Events (Admin/HR/Ausbilder sehen alle, Azubi nur eigene)' }),
    ApiResponse({ status: 200, type: [AuditResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert ein einzelnes Audit-Event' }),
    ApiResponse({ status: 200, type: AuditResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Erstellt ein Audit-Event (intern/Service)' }),
    ApiResponse({ status: 201, type: AuditResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "create", null);
AuditController = __decorate([
    ApiTags('audit'),
    ApiBearerAuth(),
    Controller({ path: 'audit', version: '1' }),
    __metadata("design:paramtypes", [AuditService])
], AuditController);
export { AuditController };
//# sourceMappingURL=audit.controller.js.map