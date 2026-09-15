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
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ReportStatus, ReportTyp } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { BerichteService } from './reports.service.js';
import { AddAttachmentDto, AddCommentDto, AddTimeEntryDto, BatchReviewDto, CreateReportDto, ReportResponseDto, ReviewReportDto, UpdateReportDto, } from './dto/report.dto.js';
let BerichteController = class BerichteController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(user, dto) {
        return this.service.create(user, dto);
    }
    findAll(user, query, azubiId, status, jahr, typ) {
        const filter = {
            azubiId,
            status: status ? status : undefined,
            jahr: jahr ? Number(jahr) : undefined,
            typ: typ ? typ : undefined,
        };
        return this.service.findAll(user, query, filter);
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
    submit(id, user) {
        return this.service.submit(id, user);
    }
    review(id, user, dto) {
        return this.service.review(id, user, dto);
    }
    visieren(id, user) {
        return this.service.visieren(id, user);
    }
    archivieren(id, user) {
        return this.service.archivieren(id, user);
    }
    cancel(id, user) {
        return this.service.cancel(id, user);
    }
    addComment(id, user, dto) {
        return this.service.addComment(id, user, dto);
    }
    getComments(id, user) {
        return this.service.getComments(id, user);
    }
    addAttachment(id, user, dto) {
        return this.service.addAttachment(id, user, dto);
    }
    getAttachments(id, user) {
        return this.service.getAttachments(id, user);
    }
    addTimeEntry(id, user, dto) {
        return this.service.addTimeEntry(id, user, dto);
    }
    getTimeEntries(id, user) {
        return this.service.getTimeEntries(id, user);
    }
    getVersions(id, user) {
        return this.service.getVersions(id, user);
    }
    getDiff(id, v1, v2, user) {
        return this.service.getDiff(id, user, Number(v1), Number(v2));
    }
    batchReview(user, dto) {
        return this.service.batchReview(user, dto);
    }
    getReviewQueue(user, query, azubiId, jahr, kalenderwoche) {
        return this.service.getReviewQueue(user, query, {
            azubiId,
            jahr: jahr ? Number(jahr) : undefined,
            kalenderwoche: kalenderwoche ? Number(kalenderwoche) : undefined,
        });
    }
    async exportReviewCsv(user, res) {
        const csv = await this.service.exportReviewCsv(user);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="berichte-review.csv"');
        res.send(csv);
    }
    async exportPdf(id, user, res) {
        const buffer = await this.service.exportPdf(id, user);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="bericht-${id}.pdf"`);
        res.send(buffer);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt einen Bericht (Azubi, Status entwurf)' }),
    ApiResponse({ status: 201, type: ReportResponseDto }),
    Roles(Role.azubi),
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateReportDto]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Berichte (rollen-/scope-berechtigt)' }),
    ApiResponse({ status: 200 }),
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __param(2, Query('azubiId')),
    __param(3, Query('status')),
    __param(4, Query('jahr')),
    __param(5, Query('typ')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PaginationQueryDto, String, String, String, String]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert einen Bericht' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Bearbeitet einen Bericht (Azubi, nur entwurf)' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    Roles(Role.azubi),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateReportDto]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht einen Bericht (Azubi, nur entwurf)' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.azubi),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "remove", null);
__decorate([
    ApiOperation({ summary: 'Reicht einen Bericht ein' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    Roles(Role.azubi),
    Post(':id/submit'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "submit", null);
__decorate([
    ApiOperation({ summary: 'Vorprüfung durch Ausbildungsbeauftragten' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    Roles(Role.ausbildungsbeauftragter),
    Post(':id/review'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ReviewReportDto]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "review", null);
__decorate([
    ApiOperation({ summary: 'Finale Visierung durch Ausbilder' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    Roles(Role.ausbilder),
    Post(':id/visieren'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "visieren", null);
__decorate([
    ApiOperation({ summary: 'Archiviert einen visierten Bericht' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    Roles(Role.ausbilder),
    Post(':id/archivieren'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "archivieren", null);
__decorate([
    ApiOperation({ summary: 'Einreichung zurückziehen (eingereicht → entwurf)' }),
    ApiResponse({ status: 200, type: ReportResponseDto }),
    ApiResponse({ status: 403, description: 'Nicht der Owner oder falscher Status' }),
    Roles(Role.azubi),
    Post(':id/cancel'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "cancel", null);
__decorate([
    ApiOperation({ summary: 'Fügt einen Kommentar hinzu' }),
    ApiResponse({ status: 201, description: 'Erstellt' }),
    Roles(Role.ausbildungsbeauftragter, Role.ausbilder),
    Post(':id/kommentare'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, AddCommentDto]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "addComment", null);
__decorate([
    ApiOperation({ summary: 'Listet Kommentare eines Berichts' }),
    ApiResponse({ status: 200 }),
    Get(':id/kommentare'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "getComments", null);
__decorate([
    ApiOperation({ summary: 'Anhang hinzufügen (Screenshot/Diagramm/Code)' }),
    ApiBody({ type: AddAttachmentDto }),
    ApiResponse({ status: 201, description: 'Anhang erstellt' }),
    ApiResponse({ status: 403, description: 'Keine Berechtigung' }),
    Post(':id/attachments'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, AddAttachmentDto]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "addAttachment", null);
__decorate([
    ApiOperation({ summary: 'Listet Anhänge eines Berichts' }),
    ApiResponse({ status: 200, description: 'Liste der Anhänge' }),
    Get(':id/attachments'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "getAttachments", null);
__decorate([
    ApiOperation({ summary: 'Zeiterfassung je Tätigkeit' }),
    ApiBody({ type: AddTimeEntryDto }),
    ApiResponse({ status: 201, description: 'Zeiteintrag erstellt' }),
    ApiResponse({ status: 403, description: 'Keine Berechtigung' }),
    Post(':id/time-entries'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, AddTimeEntryDto]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "addTimeEntry", null);
__decorate([
    ApiOperation({ summary: 'Listet Zeiteinträge eines Berichts' }),
    ApiResponse({ status: 200, description: 'Liste der Zeiteinträge' }),
    Get(':id/time-entries'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "getTimeEntries", null);
__decorate([
    ApiOperation({ summary: 'Versionshistorie eines Berichts' }),
    ApiResponse({ status: 200, description: 'Versionen chronologisch' }),
    Get(':id/versions'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "getVersions", null);
__decorate([
    ApiOperation({ summary: 'Diff zweier Versionen' }),
    ApiResponse({ status: 200, description: 'Inhalte beider Versionen' }),
    Get(':id/versions/:v1/diff/:v2'),
    __param(0, Param('id')),
    __param(1, Param('v1')),
    __param(2, Param('v2')),
    __param(3, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "getDiff", null);
__decorate([
    ApiOperation({ summary: 'Batch-Review mehrerer Berichte' }),
    ApiBody({ type: BatchReviewDto }),
    ApiResponse({ status: 200, description: 'Batch-Ergebnis mit Erfolgs/Fehler-Statistik' }),
    ApiResponse({ status: 400, description: 'Max. 100 Berichte pro Batch' }),
    Roles(Role.ausbildungsbeauftragter, Role.ausbilder),
    Post('batch-review'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BatchReviewDto]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "batchReview", null);
__decorate([
    ApiOperation({ summary: 'Review Queue — eingereichte Berichte zur Prüfung' }),
    ApiResponse({ status: 200, description: 'Eingereichte Berichte mit Azubi-Info' }),
    Roles(Role.ausbildungsbeauftragter, Role.ausbilder),
    Get('review-queue'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __param(2, Query('azubiId')),
    __param(3, Query('jahr')),
    __param(4, Query('kalenderwoche')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PaginationQueryDto, String, String, String]),
    __metadata("design:returntype", void 0)
], BerichteController.prototype, "getReviewQueue", null);
__decorate([
    ApiOperation({ summary: 'Exportiert Berichte als CSV' }),
    ApiResponse({ status: 200, description: 'CSV-Datei' }),
    Roles(Role.ausbildungsbeauftragter, Role.ausbilder),
    Get('export/review-csv'),
    RawResponse(),
    __param(0, CurrentUser()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "exportReviewCsv", null);
__decorate([
    ApiOperation({ summary: 'Exportiert einen Bericht als IHK-PDF' }),
    ApiResponse({ status: 200, description: 'PDF-Binary' }),
    Get(':id/export.pdf'),
    RawResponse(),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __param(2, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BerichteController.prototype, "exportPdf", null);
BerichteController = __decorate([
    ApiTags('berichte'),
    ApiBearerAuth(),
    Controller({ path: 'berichte', version: '1' }),
    __metadata("design:paramtypes", [BerichteService])
], BerichteController);
export { BerichteController };
//# sourceMappingURL=reports.controller.js.map