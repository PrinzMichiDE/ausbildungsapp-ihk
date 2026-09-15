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
import { AbwesenheitService } from './absence.service.js';
import { AbwesenheitResponseDto, CreateAbwesenheitDto, UpdateAbwesenheitDto, } from './dto/absence.dto.js';
let AbwesenheitController = class AbwesenheitController {
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
    update(id, user, dto) {
        return this.service.update(id, user, dto);
    }
    async remove(id, user) {
        await this.service.remove(id, user);
    }
};
__decorate([
    ApiOperation({ summary: 'Erfasst eine Abwesenheit' }),
    ApiResponse({ status: 201, type: AbwesenheitResponseDto }),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAbwesenheitDto]),
    __metadata("design:returntype", Promise)
], AbwesenheitController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Abwesenheiten (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [AbwesenheitResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbwesenheitController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Abwesenheit' }),
    ApiResponse({ status: 200, type: AbwesenheitResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AbwesenheitController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert eine Abwesenheit' }),
    ApiResponse({ status: 200, type: AbwesenheitResponseDto }),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateAbwesenheitDto]),
    __metadata("design:returntype", Promise)
], AbwesenheitController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Abwesenheit' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AbwesenheitController.prototype, "remove", null);
AbwesenheitController = __decorate([
    ApiTags('abwesenheit'),
    ApiBearerAuth(),
    Controller({ path: 'abwesenheit', version: '1' }),
    __metadata("design:paramtypes", [AbwesenheitService])
], AbwesenheitController);
export { AbwesenheitController };
//# sourceMappingURL=absence.controller.js.map