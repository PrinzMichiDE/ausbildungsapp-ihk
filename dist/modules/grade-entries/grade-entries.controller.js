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
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { GradeentryService } from './grade-entries.service.js';
import { CreateGradeEntryDto, GradeEntryResponseDto } from './dto/grade-entry.dto.js';
let GradeentryController = class GradeentryController {
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
    remove(id, user) {
        return this.service.remove(id, user);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt einen Grade-Eintrag' }),
    ApiResponse({ status: 201, type: GradeEntryResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.azubi),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateGradeEntryDto]),
    __metadata("design:returntype", Promise)
], GradeentryController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Grade-Entries (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [GradeEntryResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GradeentryController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert einen Grade-Entry' }),
    ApiResponse({ status: 200, type: GradeEntryResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GradeentryController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert einen Grade-Entry' }),
    ApiResponse({ status: 200, type: GradeEntryResponseDto }),
    Roles(Role.ausbilder, Role.hr),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], GradeentryController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht einen Grade-Entry' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.ausbilder, Role.hr),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GradeentryController.prototype, "remove", null);
GradeentryController = __decorate([
    ApiTags('grade-entries'),
    ApiBearerAuth(),
    Controller({ path: 'grade-entries', version: '1' }),
    __metadata("design:paramtypes", [GradeentryService])
], GradeentryController);
export { GradeentryController };
//# sourceMappingURL=grade-entries.controller.js.map