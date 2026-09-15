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
import { Body, Controller, Delete, Get, Ip, Param, Patch, Post, Res, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { DatenschutzService } from './data-privacy.service.js';
import { ConsentGrantDto, ConsentLogResponseDto, ConsentResponseDto, ConsentRevokeDto, CreateDatenschutzRequestDto, DatenschutzRequestResponseDto, DpiaDto, DpiaResponseDto, LegalBasisDto, LegalBasisResponseDto, ProcessDatenschutzRequestDto, UpdateDpiaDto, UpdateLegalBasisDto, } from './dto/data-privacy.dto.js';
let DatenschutzController = class DatenschutzController {
    service;
    constructor(service) {
        this.service = service;
    }
    createRequest(user, dto) {
        return this.service.createRequest(user, dto);
    }
    findAllRequests(user) {
        return this.service.findAllRequests(user);
    }
    findRequest(id, user) {
        return this.service.findRequest(id, user);
    }
    processRequest(id, user, dto) {
        return this.service.processRequest(id, user, dto);
    }
    async exportPersonalData(id, user, res) {
        const data = await this.service.exportPersonalData(id, user);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="datenschutz-export-${id}.json"`);
        res.send(data);
    }
    anonymize(azubiId, user) {
        return this.service.anonymize(azubiId, user);
    }
    findConsents(user) {
        return this.service.findConsents(user);
    }
    grantConsent(user, dto, ip) {
        return this.service.grantConsent(user, dto, ip);
    }
    revokeConsent(key, user, dto, ip) {
        return this.service.revokeConsent(user, key, dto.version, ip);
    }
    findConsentLog(user) {
        return this.service.findConsentLog(user);
    }
    findAllLegalBases() {
        return this.service.findAllLegalBases();
    }
    createLegalBasis(dto) {
        return this.service.createLegalBasis(dto);
    }
    updateLegalBasis(id, dto) {
        return this.service.updateLegalBasis(id, dto);
    }
    async removeLegalBasis(id) {
        await this.service.removeLegalBasis(id);
    }
    findAllDpia() {
        return this.service.findAllDpia();
    }
    createDpia(user, dto) {
        return this.service.createDpia(user, dto);
    }
    updateDpia(id, user, dto) {
        return this.service.updateDpia(id, user, dto);
    }
    async removeDpia(id) {
        await this.service.removeDpia(id);
    }
};
__decorate([
    ApiOperation({ summary: 'Legt einen DSGVO-Antrag (Auskunft/Export/Löschung/...) an' }),
    ApiResponse({ status: 201, type: DatenschutzRequestResponseDto }),
    Post('requests'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateDatenschutzRequestDto]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "createRequest", null);
__decorate([
    ApiOperation({ summary: 'Listet DSGVO-Anträge (scope-berechtigt)' }),
    ApiResponse({ status: 200, type: [DatenschutzRequestResponseDto] }),
    Get('requests'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "findAllRequests", null);
__decorate([
    ApiOperation({ summary: 'Liefert einen DSGVO-Antrag' }),
    ApiResponse({ status: 200, type: DatenschutzRequestResponseDto }),
    Get('requests/:id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "findRequest", null);
__decorate([
    ApiOperation({ summary: 'Bearbeitet einen DSGVO-Antrag (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 200, type: DatenschutzRequestResponseDto }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Patch('requests/:id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ProcessDatenschutzRequestDto]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "processRequest", null);
__decorate([
    ApiOperation({ summary: 'Exportiert die personenbezogenen Daten (Art. 15/20) als JSON' }),
    ApiResponse({ status: 200, type: Object }),
    RawResponse(),
    Get('requests/:id/export'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "exportPersonalData", null);
__decorate([
    ApiOperation({ summary: 'Anonymisiert einen Azubi (Recht auf Vergessenwerden)' }),
    ApiResponse({ status: 200 }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Delete('anonymize/:azubiId'),
    __param(0, Param('azubiId')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DatenschutzController.prototype, "anonymize", null);
__decorate([
    ApiOperation({ summary: 'Listet eigene Einwilligungen' }),
    ApiResponse({ status: 200, type: [ConsentResponseDto] }),
    Get('consents'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "findConsents", null);
__decorate([
    ApiOperation({ summary: 'Erteilt eine Einwilligung' }),
    ApiResponse({ status: 201, type: ConsentResponseDto }),
    Post('consents'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __param(2, Ip()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ConsentGrantDto, String]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "grantConsent", null);
__decorate([
    ApiOperation({ summary: 'Widerruft eine Einwilligung' }),
    ApiResponse({ status: 200, type: ConsentResponseDto }),
    Post('consents/:key/revoke'),
    __param(0, Param('key')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __param(3, Ip()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ConsentRevokeDto, String]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "revokeConsent", null);
__decorate([
    ApiOperation({ summary: 'Liefert das Einwilligungs-Log (Nachweis)' }),
    ApiResponse({ status: 200, type: [ConsentLogResponseDto] }),
    Get('consents/log'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "findConsentLog", null);
__decorate([
    ApiOperation({ summary: 'Listet Verarbeitungen (Art. 30)' }),
    ApiResponse({ status: 200, type: [LegalBasisResponseDto] }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Get('legal-bases'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "findAllLegalBases", null);
__decorate([
    ApiOperation({ summary: 'Legt eine Verarbeitung an (Admin/HR)' }),
    ApiResponse({ status: 201, type: LegalBasisResponseDto }),
    Roles(Role.admin, Role.hr),
    Post('legal-bases'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LegalBasisDto]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "createLegalBasis", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert eine Verarbeitung (Admin/HR)' }),
    ApiResponse({ status: 200, type: LegalBasisResponseDto }),
    Roles(Role.admin, Role.hr),
    Patch('legal-bases/:id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateLegalBasisDto]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "updateLegalBasis", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Verarbeitung (Admin)' }),
    ApiResponse({ status: 204 }),
    Roles(Role.admin),
    Delete('legal-bases/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "removeLegalBasis", null);
__decorate([
    ApiOperation({ summary: 'Listet DPIA-Einträge (Art. 35)' }),
    ApiResponse({ status: 200, type: [DpiaResponseDto] }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Get('dpia'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "findAllDpia", null);
__decorate([
    ApiOperation({ summary: 'Legt einen DPIA-Eintrag an (Admin/HR)' }),
    ApiResponse({ status: 201, type: DpiaResponseDto }),
    Roles(Role.admin, Role.hr),
    Post('dpia'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, DpiaDto]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "createDpia", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert einen DPIA-Eintrag (Admin/HR)' }),
    ApiResponse({ status: 200, type: DpiaResponseDto }),
    Roles(Role.admin, Role.hr),
    Patch('dpia/:id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateDpiaDto]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "updateDpia", null);
__decorate([
    ApiOperation({ summary: 'Löscht einen DPIA-Eintrag (Admin)' }),
    ApiResponse({ status: 204 }),
    Roles(Role.admin),
    Delete('dpia/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatenschutzController.prototype, "removeDpia", null);
DatenschutzController = __decorate([
    ApiTags('datenschutz'),
    ApiBearerAuth(),
    Controller({ path: 'datenschutz', version: '1' }),
    __metadata("design:paramtypes", [DatenschutzService])
], DatenschutzController);
export { DatenschutzController };
//# sourceMappingURL=data-privacy.controller.js.map