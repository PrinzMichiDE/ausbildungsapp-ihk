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
import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { StandortService } from './standort.service.js';
import { CreateStandortDto, UpdateStandortDto } from './dto/standort.dto.js';
let StandortController = class StandortController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(user) {
        return this.service.findAll();
    }
    async create(user, dto) {
        return this.service.create(dto);
    }
    async findOne(user, id) {
        return this.service.findOne(id);
    }
    async update(user, id, dto) {
        return this.service.update(id, dto);
    }
    async remove(user, id) {
        return this.service.remove(id);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Alle Standorte auflisten' }),
    ApiBearerAuth(),
    Roles(Role.admin, Role.ausbildungsbeauftragter, Role.ausbilder, Role.hr),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StandortController.prototype, "findAll", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Neuen Standort erstellen' }),
    ApiBearerAuth(),
    Roles(Role.admin),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateStandortDto]),
    __metadata("design:returntype", Promise)
], StandortController.prototype, "create", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Standort abrufen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StandortController.prototype, "findOne", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Standort aktualisieren' }),
    ApiBearerAuth(),
    Roles(Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateStandortDto]),
    __metadata("design:returntype", Promise)
], StandortController.prototype, "update", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Standort löschen' }),
    ApiBearerAuth(),
    Roles(Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StandortController.prototype, "remove", null);
StandortController = __decorate([
    ApiTags('standort'),
    Controller({ path: 'standort', version: '1' }),
    __metadata("design:paramtypes", [StandortService])
], StandortController);
export { StandortController };
//# sourceMappingURL=standort.controller.js.map