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
import { WikiService } from './wiki.service.js';
import { CreateWikiPageDto, UpdateWikiPageDto, WikiPageResponseDto, } from './dto/wiki.dto.js';
let WikiController = class WikiController {
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
    findBySlug(slug) {
        return this.service.findBySlug(slug);
    }
    findOne(id) {
        return this.service.getById(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    async remove(id) {
        await this.service.remove(id);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt eine Wiki-Seite (Admin/Ausbilder)' }),
    ApiResponse({ status: 201, type: WikiPageResponseDto }),
    Roles(Role.admin, Role.ausbilder),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateWikiPageDto]),
    __metadata("design:returntype", Promise)
], WikiController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet alle Wiki-Seiten' }),
    ApiResponse({ status: 200, type: [WikiPageResponseDto] }),
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WikiController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Wiki-Seite per Slug' }),
    ApiResponse({ status: 200, type: WikiPageResponseDto }),
    Get('slug/:slug'),
    __param(0, Param('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiController.prototype, "findBySlug", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Wiki-Seite per ID' }),
    ApiResponse({ status: 200, type: WikiPageResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert eine Wiki-Seite (Admin/Ausbilder)' }),
    ApiResponse({ status: 200, type: WikiPageResponseDto }),
    Roles(Role.admin, Role.ausbilder),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateWikiPageDto]),
    __metadata("design:returntype", Promise)
], WikiController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Wiki-Seite (Admin/Ausbilder)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.admin, Role.ausbilder),
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiController.prototype, "remove", null);
WikiController = __decorate([
    ApiTags('wiki'),
    ApiBearerAuth(),
    Controller({ path: 'wiki', version: '1' }),
    __metadata("design:paramtypes", [WikiService])
], WikiController);
export { WikiController };
//# sourceMappingURL=wiki.controller.js.map