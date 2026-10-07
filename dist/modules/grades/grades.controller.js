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
import { Body, Controller, Delete, Get, Param, Post, Query, Res, HttpCode, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { NotenService } from './grades.service.js';
import { CreateGradeDto, GradeResponseDto, GradeVersionResponseDto } from './dto/grade.dto.js';
let NotenController = class NotenController {
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
    warnliste(user) {
        return this.service.getWarnliste(user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    confirm(id, user) {
        return this.service.confirm(id, user);
    }
    visieren(id, user) {
        return this.service.visieren(id, user);
    }
    archivieren(id, user) {
        return this.service.archivieren(id, user);
    }
    bewerten(id, user, dto) {
        return this.service.bewerten(id, user, dto);
    }
    zeugnisUpload(id, user, dto) {
        return this.service.zeugnisUpload(id, user, dto);
    }
    wiederholung(id, user, dto) {
        return this.service.wiederholung(id, user, dto);
    }
    addMaßnahme(id, user, dto) {
        return this.service.addMaßnahme(id, user, dto);
    }
    getVersions(id, user) {
        return this.service.getVersions(id, user);
    }
    getDiff(id, v1, v2, user) {
        return this.service.getDiff(id, user, v1, v2);
    }
    getGPA(id, user) {
        return this.service.getGPA(id, user);
    }
    dashboard(user, query) {
        return this.service.getDashboard(user, query);
    }
    async remove(id, user) {
        await this.service.remove(id, user);
    }
    async exportCsv(user, query) {
        const csv = await this.service.exportCsv(user, query?.azubiId);
        return csv;
    }
    async exportPdf(id, user, res) {
        const pdf = await this.service.exportPdf(user, id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="zeugnis-${id}.pdf"`);
        res.send(pdf);
    }
    async exportDsgvo(id, user) {
        return this.service.exportDsgvo(user, id);
    }
    async anonymizeDsgvo(id, user) {
        await this.service.anonymizeDsgvo(user, id);
    }
    async deleteDsgvo(azubiId, user) {
        await this.service.deleteDsgvo(user, azubiId);
    }
};
__decorate([
    ApiOperation({ summary: 'Erfasst eine Note (Ausbilder/HR)' }),
    ApiResponse({ status: 201, type: GradeResponseDto }),
    Roles(Role.ausbilder, Role.hr),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateGradeDto]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Noten (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [GradeResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Frühwarnsystem: Noten ab 4.x' }),
    ApiResponse({ status: 200 }),
    Roles(Role.ausbilder, Role.hr),
    Get('warnliste'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotenController.prototype, "warnliste", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Note' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Bestätigt eine Note (Ausbilder)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder),
    Post(':id/confirm'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "confirm", null);
__decorate([
    ApiOperation({ summary: 'Visiert eine Note (Ausbilder)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder),
    Post(':id/visieren'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "visieren", null);
__decorate([
    ApiOperation({ summary: 'Archiviert eine visierte Note (Ausbilder)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder),
    Post(':id/archivieren'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "archivieren", null);
__decorate([
    ApiOperation({ summary: 'Bewertet eine Note (Ausbilder/HR)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder, Role.hr),
    Post(':id/bewerten'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "bewerten", null);
__decorate([
    ApiOperation({ summary: 'Lädt Zeugnis hoch (Ausbilder/HR)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder, Role.hr),
    Post(':id/zeugnis'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "zeugnisUpload", null);
__decorate([
    ApiOperation({ summary: 'Dokumentiert Wiederholung (Ausbilder/HR)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder, Role.hr),
    Post(':id/wiederholung'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "wiederholung", null);
__decorate([
    ApiOperation({ summary: 'Fügt Fördermaßnahme hinzu (Ausbilder/HR)' }),
    ApiResponse({ status: 200, type: GradeResponseDto }),
    Roles(Role.ausbilder, Role.hr),
    Post(':id/maßnahme'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "addMa\u00DFnahme", null);
__decorate([
    ApiOperation({ summary: 'Versionshistorie einer Note' }),
    ApiResponse({ status: 200, type: [GradeVersionResponseDto] }),
    Get(':id/versions'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotenController.prototype, "getVersions", null);
__decorate([
    ApiOperation({ summary: 'Diff zwischen zwei Versionen' }),
    ApiResponse({ status: 200 }),
    Get(':id/versions/:v1/diff/:v2'),
    __param(0, Param('id')),
    __param(1, Param('v1')),
    __param(2, Param('v2')),
    __param(3, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], NotenController.prototype, "getDiff", null);
__decorate([
    ApiOperation({ summary: 'GPA eines Azubis' }),
    ApiResponse({ status: 200 }),
    Get(':id/gpa'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotenController.prototype, "getGPA", null);
__decorate([
    ApiOperation({ summary: 'Noten-Tracker Dashboard' }),
    ApiResponse({ status: 200 }),
    Get('dashboard'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotenController.prototype, "dashboard", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Note (Ausbilder/HR)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.ausbilder, Role.hr),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "remove", null);
__decorate([
    ApiOperation({ summary: 'CSV-Export der Noten' }),
    ApiResponse({ status: 200, description: 'CSV-Daten' }),
    Roles(Role.ausbilder, Role.hr),
    Get('export/csv'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "exportCsv", null);
__decorate([
    ApiOperation({ summary: 'PDF-Zeugnis generieren' }),
    ApiResponse({ status: 200, description: 'PDF-Buffer' }),
    Roles(Role.ausbilder, Role.hr),
    Get(':id/export/pdf'),
    HttpCode(200),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "exportPdf", null);
__decorate([
    ApiOperation({ summary: 'DSGVO-Export aller Notendaten eines Azubis' }),
    ApiResponse({ status: 200, description: 'JSON-Daten' }),
    Roles(Role.hr, Role.admin),
    Get(':id/export/datenschutz'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "exportDsgvo", null);
__decorate([
    ApiOperation({ summary: 'DSGVO-Anonymisierung einer Note' }),
    ApiResponse({ status: 200, description: 'Anonymisiert' }),
    Roles(Role.hr, Role.admin),
    Delete(':id/datenschutz'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "anonymizeDsgvo", null);
__decorate([
    ApiOperation({ summary: 'DSGVO-Löschung einer Note (Art.17)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.hr, Role.admin),
    Delete(':id/datenschutz/:azubiId'),
    __param(0, Param('azubiId')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotenController.prototype, "deleteDsgvo", null);
NotenController = __decorate([
    ApiTags('noten'),
    ApiBearerAuth(),
    Controller({ path: 'noten', version: '1' }),
    __metadata("design:paramtypes", [NotenService])
], NotenController);
export { NotenController };
//# sourceMappingURL=grades.controller.js.map