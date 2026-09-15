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
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { AusbildungsplanService } from './ausbildungsplan.service.js';
import { CreateAusbildungsplanDto, UpdateAusbildungsplanDto } from './dto/ausbildungsplan.dto.js';
let AusbildungsplanController = class AusbildungsplanController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(user) {
        return this.service.findAll(user);
    }
    async create(user, dto) {
        return this.service.create(user, dto);
    }
    async findOne(user, id) {
        return this.service.findOne(user, id);
    }
    async update(user, id, dto) {
        return this.service.update(user, id, dto);
    }
    async remove(user, id) {
        return this.service.remove(user, id);
    }
    async submit(user, id) {
        return this.service.submit(user, id);
    }
    async review(user, id) {
        return this.service.review(user, id);
    }
    async approve(user, id) {
        return this.service.approve(user, id);
    }
    async getRahmenlehrplan(user, id) {
        return this.service.getRahmenlehrplan(user, id);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Alle Ausbildungspläne auflisten' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "findAll", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Neuen Ausbildungsplan erstellen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAusbildungsplanDto]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "create", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Ausbildungsplan详情' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "findOne", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Ausbildungsplan aktualisieren' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateAusbildungsplanDto]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Ausbildungsplan löschen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "remove", null);
__decorate([
    Post(':id/einreichen'),
    ApiOperation({ summary: 'Ausbildungsplan einreichen' }),
    ApiBearerAuth(),
    Roles(Role.azubi),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "submit", null);
__decorate([
    Post(':id/pruefen'),
    ApiOperation({ summary: 'Ausbildungsplan prüfen' }),
    ApiBearerAuth(),
    Roles(Role.ausbildungsbeauftragter),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "review", null);
__decorate([
    Post(':id/genehmigen'),
    ApiOperation({ summary: 'Ausbildungsplan genehmigen' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "approve", null);
__decorate([
    Get(':id/rahmenlehrplan'),
    ApiOperation({ summary: 'Rahmenlehrplan abrufen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsplanController.prototype, "getRahmenlehrplan", null);
AusbildungsplanController = __decorate([
    ApiTags('ausbildungsplan'),
    Controller({ path: 'ausbildungsplan', version: '1' }),
    __metadata("design:paramtypes", [AusbildungsplanService])
], AusbildungsplanController);
export { AusbildungsplanController };
//# sourceMappingURL=ausbildungsplan.controller.js.map