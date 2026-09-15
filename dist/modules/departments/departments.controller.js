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
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { AbteilungenService } from './departments.service.js';
import { AbteilungResponseDto, CreateAbteilungDto, UpdateAbteilungDto, } from './dto/abteilung.dto.js';
let AbteilungenController = class AbteilungenController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    async remove(id) {
        await this.service.remove(id);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt eine Abteilung (Admin)' }),
    ApiResponse({ status: 201, type: AbteilungResponseDto }),
    Roles(Role.admin),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAbteilungDto]),
    __metadata("design:returntype", Promise)
], AbteilungenController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet alle Abteilungen' }),
    ApiResponse({ status: 200, type: [AbteilungResponseDto] }),
    Roles(Role.admin, Role.ausbildungsbeauftragter, Role.ausbilder, Role.hr),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AbteilungenController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Abteilung' }),
    ApiResponse({ status: 200, type: AbteilungResponseDto }),
    Roles(Role.admin, Role.ausbildungsbeauftragter, Role.ausbilder, Role.hr),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AbteilungenController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert eine Abteilung (Admin)' }),
    ApiResponse({ status: 200, type: AbteilungResponseDto }),
    Roles(Role.admin),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAbteilungDto]),
    __metadata("design:returntype", Promise)
], AbteilungenController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Abteilung (Admin)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.admin),
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AbteilungenController.prototype, "remove", null);
AbteilungenController = __decorate([
    ApiTags('abteilungen'),
    ApiBearerAuth(),
    Controller({ path: 'abteilungen', version: '1' }),
    __metadata("design:paramtypes", [AbteilungenService])
], AbteilungenController);
export { AbteilungenController };
//# sourceMappingURL=departments.controller.js.map