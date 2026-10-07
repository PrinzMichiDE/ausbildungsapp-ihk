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
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AusbildungsnachweisService } from './ausbildungsnachweis.service.js';
import { CreateAusbildungsnachweisDto, UpdateAusbildungsnachweisDto, AddCommentDto, AddVersionDto } from './dto/ausbildungsnachweis.dto.js';
let AusbildungsnachweisController = class AusbildungsnachweisController {
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
    async submit(user, id) {
        return this.service.submit(user, id);
    }
    async review(user, id) {
        return this.service.review(user, id);
    }
    async approve(user, id) {
        return this.service.approve(user, id);
    }
    async archive(user, id) {
        return this.service.archive(user, id);
    }
    async addComment(user, id, dto) {
        return this.service.addComment(user, id, dto);
    }
    async addVersion(user, id, dto) {
        return this.service.addVersion(user, id, dto);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Alle Ausbildungsnachweise auflisten' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "findAll", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Neuen Ausbildungsnachweis erstellen' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateAusbildungsnachweisDto]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "create", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Ausbildungsnachweis abrufen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "findOne", null);
__decorate([
    Put(':id'),
    ApiOperation({ summary: 'Ausbildungsnachweis aktualisieren' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateAusbildungsnachweisDto]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "update", null);
__decorate([
    Post(':id/einreichen'),
    ApiOperation({ summary: 'Nachweis einreichen' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "submit", null);
__decorate([
    Post(':id/pruefen'),
    ApiOperation({ summary: 'Nachweis prüfen' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "review", null);
__decorate([
    Post(':id/freigeben'),
    ApiOperation({ summary: 'Nachweis freigeben' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin, Role.hr),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "approve", null);
__decorate([
    Post(':id/archivieren'),
    ApiOperation({ summary: 'Nachweis archivieren' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "archive", null);
__decorate([
    Post(':id/kommentare'),
    ApiOperation({ summary: 'Kommentar hinzufügen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AddCommentDto]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "addComment", null);
__decorate([
    Post(':id/versionen'),
    ApiOperation({ summary: 'Neue Version erstellen' }),
    ApiBearerAuth(),
    Roles(Role.ausbilder, Role.admin),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AddVersionDto]),
    __metadata("design:returntype", Promise)
], AusbildungsnachweisController.prototype, "addVersion", null);
AusbildungsnachweisController = __decorate([
    ApiTags('ausbildungsnachweis'),
    Controller({ path: 'ausbildungsnachweis', version: '1' }),
    __metadata("design:paramtypes", [AusbildungsnachweisService])
], AusbildungsnachweisController);
export { AusbildungsnachweisController };
//# sourceMappingURL=ausbildungsnachweis.controller.js.map