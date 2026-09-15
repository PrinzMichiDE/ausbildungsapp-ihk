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
import { FrameworksService } from './frameworks.service.js';
import { CreateFrameworkDto, FrameworkResponseDto, UpdateFrameworkDto, } from './dto/learning-content.dto.js';
let FrameworksController = class FrameworksController {
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
    getTree(id) {
        return this.service.getTree(id);
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
    ApiOperation({ summary: 'Erstellt einen IHK-Rahmenplan-Eintrag' }),
    ApiResponse({ status: 201, type: FrameworkResponseDto }),
    Roles(Role.admin, Role.ausbilder),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFrameworkDto]),
    __metadata("design:returntype", Promise)
], FrameworksController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Rahmenplan-Einträge' }),
    ApiResponse({ status: 200, type: [FrameworkResponseDto] }),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FrameworksController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert Rahmenplan inkl. Kurse/Aufgaben' }),
    ApiResponse({ status: 200 }),
    Get(':id/tree'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FrameworksController.prototype, "getTree", null);
__decorate([
    ApiOperation({ summary: 'Liefert einen Rahmenplan-Eintrag' }),
    ApiResponse({ status: 200, type: FrameworkResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FrameworksController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert einen Rahmenplan-Eintrag' }),
    ApiResponse({ status: 200, type: FrameworkResponseDto }),
    Roles(Role.admin, Role.ausbilder),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateFrameworkDto]),
    __metadata("design:returntype", Promise)
], FrameworksController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht einen Rahmenplan-Eintrag' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.admin, Role.ausbilder),
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FrameworksController.prototype, "remove", null);
FrameworksController = __decorate([
    ApiTags('frameworks'),
    ApiBearerAuth(),
    Controller({ path: 'frameworks', version: '1' }),
    __metadata("design:paramtypes", [FrameworksService])
], FrameworksController);
export { FrameworksController };
//# sourceMappingURL=frameworks.controller.js.map