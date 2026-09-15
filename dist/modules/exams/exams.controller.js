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
import { PruefungService } from './exams.service.js';
import { PruefungResponseDto, CreatePruefungDto, UpdatePruefungDto, PruefungsMeilensteinResponseDto, CreateMeilensteinDto, UpdateMeilensteinDto, } from './dto/exams.dto.js';
let PruefungController = class PruefungController {
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
    statusChange(id, status, user) {
        return this.service.statusChange(id, user, status);
    }
    addMeilenstein(id, user, dto) {
        return this.service.addMeilenstein(id, user, dto);
    }
    updateMeilenstein(id, meilensteinId, user, dto) {
        return this.service.updateMeilenstein(id, meilensteinId, user, dto);
    }
    completeMeilenstein(id, meilensteinId, user) {
        return this.service.completeMeilenstein(id, meilensteinId, user);
    }
    async remove(id, user) {
        await this.service.remove(id, user);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt eine neue Prüfung (Azubi)' }),
    ApiResponse({ status: 201, type: PruefungResponseDto }),
    Roles(Role.azubi, Role.ausbilder, Role.hr, Role.admin),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreatePruefungDto]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Prüfungen (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [PruefungResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Prüfung mit Meilensteinen' }),
    ApiResponse({ status: 200, type: PruefungResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert eine Prüfung (nur angemeldet)' }),
    ApiResponse({ status: 200, type: PruefungResponseDto }),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePruefungDto, Object]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Ändert den Prüfungsstatus (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 200, type: PruefungResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Patch(':id/status/:status'),
    __param(0, Param('id')),
    __param(1, Param('status')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "statusChange", null);
__decorate([
    ApiOperation({ summary: 'Legt einen Meilenstein an (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 201, type: PruefungsMeilensteinResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Post(':id/meilensteine'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, CreateMeilensteinDto]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "addMeilenstein", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert einen Meilenstein (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 200, type: PruefungsMeilensteinResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Patch(':id/meilensteine/:meilensteinId'),
    __param(0, Param('id')),
    __param(1, Param('meilensteinId')),
    __param(2, CurrentUser()),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, UpdateMeilensteinDto]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "updateMeilenstein", null);
__decorate([
    ApiOperation({ summary: 'Markiert einen Meilenstein als erledigt' }),
    ApiResponse({ status: 200, type: PruefungsMeilensteinResponseDto }),
    Post(':id/meilensteine/:meilensteinId/complete'),
    __param(0, Param('id')),
    __param(1, Param('meilensteinId')),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "completeMeilenstein", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Prüfung (nur angemeldet)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PruefungController.prototype, "remove", null);
PruefungController = __decorate([
    ApiTags('pruefungen'),
    ApiBearerAuth(),
    Controller({ path: 'pruefungen', version: '1' }),
    __metadata("design:paramtypes", [PruefungService])
], PruefungController);
export { PruefungController };
//# sourceMappingURL=exams.controller.js.map