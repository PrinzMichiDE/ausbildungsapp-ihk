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
import { Body, Controller, Delete, Get, Patch, Post, Param, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ProjektService } from './projects.service.js';
import { ProjektResponseDto, CreateProjektDto, UpdateProjektDto, } from './dto/projekt.dto.js';
let ProjektController = class ProjektController {
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
    update(id, dto, user) {
        return this.service.update(id, user, dto);
    }
    submit(id, user) {
        return this.service.submit(id, user);
    }
    review(id, user, dto) {
        return this.service.review(id, user, dto);
    }
    requestRevision(id, user) {
        return this.service.requestRevision(id, user);
    }
    archive(id, user) {
        return this.service.archive(id, user);
    }
    async remove(id, user) {
        await this.service.remove(id, user);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt ein neues Projekt (Azubi)' }),
    ApiResponse({ status: 201, type: ProjektResponseDto }),
    Roles(Role.azubi, Role.ausbilder, Role.hr, Role.admin),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateProjektDto]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Projekte (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [ProjektResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert ein Projekt' }),
    ApiResponse({ status: 200, type: ProjektResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert ein Projekt (Entwurf/Abgelehnt)' }),
    ApiResponse({ status: 200, type: ProjektResponseDto }),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateProjektDto, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Reicht das Projekt zur Prüfung ein (Azubi)' }),
    ApiResponse({ status: 200, type: ProjektResponseDto }),
    Post(':id/submit'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "submit", null);
__decorate([
    ApiOperation({ summary: 'Reviewt ein Projekt (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 200, type: ProjektResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Post(':id/review'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "review", null);
__decorate([
    ApiOperation({ summary: 'Fordert Überarbeitung an (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 200, type: ProjektResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Post(':id/revision'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "requestRevision", null);
__decorate([
    ApiOperation({ summary: 'Archiviert ein Projekt (Ausbilder/Admin)' }),
    ApiResponse({ status: 204, description: 'Archiviert' }),
    Roles(Role.ausbilder, Role.admin),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "archive", null);
__decorate([
    ApiOperation({ summary: 'Löscht ein Projekt' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Delete(':id/hard'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProjektController.prototype, "remove", null);
ProjektController = __decorate([
    ApiTags('projekte'),
    ApiBearerAuth(),
    Controller({ path: 'projekte', version: '1' }),
    __metadata("design:paramtypes", [ProjektService])
], ProjektController);
export { ProjektController };
//# sourceMappingURL=projects.controller.js.map