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
import { Controller, Get, Param, Query, Res, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ReportingService } from './reporting.service.js';
import { AbteilungsZufriedenheitDto, ExportKindDto, ExportQueryDto, ReportQuoteDto, SkillCoverageDto, } from './dto/reporting.dto.js';
let ReportingController = class ReportingController {
    service;
    constructor(service) {
        this.service = service;
    }
    getDashboard(user) {
        return this.service.getDashboard(user);
    }
    reportQuote(user, jahr) {
        return this.service.reportQuote(user, jahr ? Number(jahr) : undefined);
    }
    skillCoverage(user) {
        return this.service.skillCoverage(user);
    }
    abteilungsZufriedenheit(user) {
        return this.service.abteilungsZufriedenheit(user);
    }
    async exportCsv(params, query, user, res) {
        const result = await this.service.exportCsv(user, params, query);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.send(result.csv);
    }
};
__decorate([
    ApiOperation({ summary: 'Rollenspezifisches Dashboard' }),
    ApiResponse({ status: 200, type: Object }),
    Get('dashboard'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "getDashboard", null);
__decorate([
    ApiOperation({ summary: 'Berichtsheft-Quote je Azubi (Ausbilder/HR/Admin)' }),
    ApiResponse({ status: 200, type: [ReportQuoteDto] }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Get('kpis/report-quote'),
    __param(0, CurrentUser()),
    __param(1, Query('jahr')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "reportQuote", null);
__decorate([
    ApiOperation({ summary: 'Kompetenzabdeckung je Kurs' }),
    ApiResponse({ status: 200, type: [SkillCoverageDto] }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Get('kpis/skill-coverage'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "skillCoverage", null);
__decorate([
    ApiOperation({ summary: 'Abteilungsdurchlauf-Zufriedenheit' }),
    ApiResponse({ status: 200, type: [AbteilungsZufriedenheitDto] }),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Get('kpis/abteilungs-zufriedenheit'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "abteilungsZufriedenheit", null);
__decorate([
    ApiOperation({ summary: 'CSV-Export von Kennzahlen (attendance|grades|competency)' }),
    RawResponse(),
    Roles(Role.ausbilder, Role.hr, Role.admin),
    Get('export/:kind'),
    __param(0, Param()),
    __param(1, Query()),
    __param(2, CurrentUser()),
    __param(3, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ExportKindDto,
        ExportQueryDto, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportingController.prototype, "exportCsv", null);
ReportingController = __decorate([
    ApiTags('reporting'),
    ApiBearerAuth(),
    Controller({ path: 'reporting', version: '1' }),
    __metadata("design:paramtypes", [ReportingService])
], ReportingController);
export { ReportingController };
//# sourceMappingURL=reporting.controller.js.map