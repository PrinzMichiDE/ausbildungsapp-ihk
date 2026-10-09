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
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { EinsatzplanungService } from './einsatzplanung.service.js';
import { CreateEinsatzPlanungDto, UpdateEinsatzPlanungDto, EinsatzPlanungQueryDto, EinsatzPlanungResponseDto, EinsatzUserAssignmentDto, } from './dto/einsatzplanung.dto.js';
let EinsatzplanungController = class EinsatzplanungController {
    einsatzplanungService;
    constructor(einsatzplanungService) {
        this.einsatzplanungService = einsatzplanungService;
    }
    async findAll(query, currentUser) {
        return this.einsatzplanungService.findAll(query, currentUser);
    }
    async findById(id, user) {
        return this.einsatzplanungService.findById(id, user);
    }
    async create(dto, user) {
        return this.einsatzplanungService.create(dto, user.id);
    }
    async update(id, dto, user) {
        return this.einsatzplanungService.update(id, dto, user.id);
    }
    async remove(id, user) {
        return this.einsatzplanungService.remove(id, user.id);
    }
    async getCalendarView(query, currentUser) {
        return this.einsatzplanungService.getCalendarView(query, currentUser);
    }
    async assignUser(id, dto, user) {
        return this.einsatzplanungService.assignUser(id, dto, user.id);
    }
};
__decorate([
    Get(),
    Roles('azubi', 'ausbildungsbeauftragter', 'ausbilder', 'hr', 'admin'),
    ApiOperation({ summary: 'Liste alle Einsatzplanungseinträge mit Filtern' }),
    ApiResponse({
        status: 200,
        description: 'Paginierte Liste der Einsatzplanungseinträge',
        type: [EinsatzPlanungResponseDto],
    }),
    __param(0, Query()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EinsatzPlanungQueryDto, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    Roles('azubi', 'ausbildungsbeauftragter', 'ausbilder', 'hr', 'admin'),
    ApiOperation({ summary: 'Lies einen Einsatzplanungseintrag nach ID' }),
    ApiResponse({
        status: 200,
        description: 'Einsatzplanungseintrag',
        type: EinsatzPlanungResponseDto,
    }),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "findById", null);
__decorate([
    Post(),
    Roles('ausbildungsbeauftragter', 'hr', 'admin'),
    ApiOperation({ summary: 'Erstellt einen neuen Einsatzplanungseintrag' }),
    ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Neuer Einsatzplanungseintrag wurde erstellt',
        type: EinsatzPlanungResponseDto,
    }),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEinsatzPlanungDto, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "create", null);
__decorate([
    Patch(':id'),
    Roles('ausbildungsbeauftragter', 'hr', 'admin'),
    ApiOperation({ summary: 'Aktualisiert einen Einsatzplanungseintrag (Partial)' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Einsatzplanungseintrag wurde aktualisiert',
        type: EinsatzPlanungResponseDto,
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateEinsatzPlanungDto, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "update", null);
__decorate([
    Delete(':id'),
    Roles('ausbildungsbeauftragter', 'hr', 'admin'),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary: 'Löscht einen Einsatzplanungseintrag' }),
    ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Einsatzplanungseintrag wurde gelöscht',
    }),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "remove", null);
__decorate([
    Get('calendar'),
    Roles('azubi', 'ausbildungsbeauftragter', 'ausbilder', 'hr', 'admin'),
    ApiOperation({ summary: 'Kalenderansicht aller Einsätze in einem Zeitraum' }),
    ApiResponse({
        status: 200,
        description: 'Kalenderansicht der Einsätze',
        type: [EinsatzPlanungResponseDto],
    }),
    __param(0, Query()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EinsatzPlanungQueryDto, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "getCalendarView", null);
__decorate([
    Post(':id/assign'),
    Roles('ausbildungsbeauftragter', 'hr', 'admin'),
    ApiOperation({ summary: 'Weist einen Azubi einem Einsatz zu' }),
    ApiResponse({
        status: HttpStatus.OK,
        description: 'Azubi wurde erfolgreich zugewiesen',
        type: EinsatzPlanungResponseDto,
    }),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, EinsatzUserAssignmentDto, Object]),
    __metadata("design:returntype", Promise)
], EinsatzplanungController.prototype, "assignUser", null);
EinsatzplanungController = __decorate([
    ApiTags('Einsatzplanung'),
    ApiBearerAuth(),
    Controller({ path: 'einsatzplanung', version: '1' }),
    __metadata("design:paramtypes", [EinsatzplanungService])
], EinsatzplanungController);
export { EinsatzplanungController };
//# sourceMappingURL=einsatzplanung.controller.js.map