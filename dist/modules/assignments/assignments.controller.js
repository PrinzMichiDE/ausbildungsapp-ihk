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
import { EinsatzService } from './assignments.service.js';
import { CreateEinsatzDto, EinsatzResponseDto, UpdateEinsatzDto, } from './dto/assignments.dto.js';
let EinsatzController = class EinsatzController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(user) {
        return this.service.findAll(user);
    }
    getPlan(user) {
        return this.service.getPlan(user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user);
    }
    async remove(id, user) {
        await this.service.remove(id, user);
    }
};
__decorate([
    ApiOperation({ summary: 'Legt einen Abteilungseinsatz an (Ausbilder)' }),
    ApiResponse({ status: 201, type: EinsatzResponseDto }),
    Roles(Role.ausbilder),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEinsatzDto]),
    __metadata("design:returntype", Promise)
], EinsatzController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Einsätze (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [EinsatzResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EinsatzController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Rotationsplan (aktiv & zukünftig)' }),
    ApiResponse({ status: 200 }),
    Get('plan'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EinsatzController.prototype, "getPlan", null);
__decorate([
    ApiOperation({ summary: 'Liefert einen Einsatz' }),
    ApiResponse({ status: 200, type: EinsatzResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EinsatzController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert einen Einsatz (Ausbilder)' }),
    ApiResponse({ status: 200, type: EinsatzResponseDto }),
    Roles(Role.ausbilder),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateEinsatzDto, Object]),
    __metadata("design:returntype", Promise)
], EinsatzController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht einen Einsatz (Ausbilder)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.ausbilder),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EinsatzController.prototype, "remove", null);
EinsatzController = __decorate([
    ApiTags('einsatz'),
    ApiBearerAuth(),
    Controller({ path: 'einsatz', version: '1' }),
    __metadata("design:paramtypes", [EinsatzService])
], EinsatzController);
export { EinsatzController };
//# sourceMappingURL=assignments.controller.js.map