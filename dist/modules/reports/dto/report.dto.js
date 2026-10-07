var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus, ReportTyp } from '@prisma/client';
import { IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength, } from 'class-validator';
export var AttachmentTyp;
(function (AttachmentTyp) {
    AttachmentTyp["screenshot"] = "screenshot";
    AttachmentTyp["diagramm"] = "diagramm";
    AttachmentTyp["code"] = "code";
    AttachmentTyp["sonstiges"] = "sonstiges";
})(AttachmentTyp || (AttachmentTyp = {}));
export var KommentarArt;
(function (KommentarArt) {
    KommentarArt["allgemein"] = "allgemein";
    KommentarArt["fachlich"] = "fachlich";
    KommentarArt["formal"] = "formal";
    KommentarArt["aufgabenkopplung"] = "aufgabenkopplung";
})(KommentarArt || (KommentarArt = {}));
export class CreateReportDto {
    titel;
    typ;
    kalenderwoche;
    jahr;
    datumVon;
    datumBis;
    inhaltMarkdown;
    taskIds;
}
__decorate([
    ApiProperty({ example: 'KW 12 – Netzwerkinfrastruktur' }),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], CreateReportDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ enum: ReportTyp, example: ReportTyp.betrieb }),
    IsEnum(ReportTyp),
    __metadata("design:type", String)
], CreateReportDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ example: 12, minimum: 1, maximum: 53 }),
    IsInt(),
    Min(1),
    Max(53),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "kalenderwoche", void 0);
__decorate([
    ApiProperty({ example: 2026 }),
    IsInt(),
    Min(2000),
    Max(2100),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty({ example: '2026-03-16' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "datumVon", void 0);
__decorate([
    ApiProperty({ example: '2026-03-20' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "datumBis", void 0);
__decorate([
    ApiProperty({ description: 'Markdown inkl. Code-Blöcken' }),
    IsString(),
    MinLength(1),
    __metadata("design:type", String)
], CreateReportDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true }),
    IsOptional(),
    IsArray(),
    IsUUID('4', { each: true }),
    __metadata("design:type", Array)
], CreateReportDto.prototype, "taskIds", void 0);
export class UpdateReportDto {
    titel;
    typ;
    kalenderwoche;
    jahr;
    datumVon;
    datumBis;
    inhaltMarkdown;
    taskIds;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false, enum: ReportTyp }),
    IsOptional(),
    IsEnum(ReportTyp),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsInt(),
    Min(1),
    Max(53),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "kalenderwoche", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsInt(),
    Min(2000),
    Max(2100),
    __metadata("design:type", Number)
], UpdateReportDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "datumVon", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "datumBis", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateReportDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true }),
    IsOptional(),
    IsArray(),
    IsUUID('4', { each: true }),
    __metadata("design:type", Array)
], UpdateReportDto.prototype, "taskIds", void 0);
export class ReviewReportDto {
    entscheidung;
    kommentar;
}
__decorate([
    ApiProperty({ enum: ['freigeben', 'zurueck'], example: 'freigeben' }),
    IsEnum(['freigeben', 'zurueck']),
    __metadata("design:type", String)
], ReviewReportDto.prototype, "entscheidung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], ReviewReportDto.prototype, "kommentar", void 0);
export class AddCommentDto {
    text;
    art;
}
__decorate([
    ApiProperty({ example: 'Bitte den SSH-Härtungs-Schritt ergänzen.' }),
    IsString(),
    MinLength(1),
    MaxLength(2000),
    __metadata("design:type", String)
], AddCommentDto.prototype, "text", void 0);
__decorate([
    ApiProperty({ enum: KommentarArt, required: false, example: KommentarArt.allgemein }),
    IsOptional(),
    IsEnum(KommentarArt),
    __metadata("design:type", String)
], AddCommentDto.prototype, "art", void 0);
export class ReportResponseDto {
    id;
    azubiId;
    titel;
    typ;
    kalenderwoche;
    jahr;
    datumVon;
    datumBis;
    inhaltMarkdown;
    status;
    signiertVon;
    signiertAm;
    archiviertAm;
    taskIds;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ enum: ReportTyp }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ReportResponseDto.prototype, "kalenderwoche", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ReportResponseDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "datumVon", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "datumBis", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ enum: ReportStatus }),
    __metadata("design:type", String)
], ReportResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ReportResponseDto.prototype, "signiertVon", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ReportResponseDto.prototype, "signiertAm", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ReportResponseDto.prototype, "archiviertAm", void 0);
__decorate([
    ApiProperty({ isArray: true }),
    __metadata("design:type", Array)
], ReportResponseDto.prototype, "taskIds", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ReportResponseDto.prototype, "createdAt", void 0);
export class AddAttachmentDto {
    typ;
    dateiUrl;
    kommentar;
}
__decorate([
    ApiProperty({ enum: AttachmentTyp, example: AttachmentTyp.screenshot }),
    IsEnum(AttachmentTyp),
    __metadata("design:type", String)
], AddAttachmentDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ example: 'https://storage.example.com/report-attachment.png' }),
    IsString(),
    MinLength(1),
    __metadata("design:type", String)
], AddAttachmentDto.prototype, "dateiUrl", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Screenshot der Netzwerkkonfiguration' }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], AddAttachmentDto.prototype, "kommentar", void 0);
export class AddTimeEntryDto {
    taskId;
    stunden;
    kommentar;
}
__decorate([
    ApiProperty({ required: false, description: 'Verknüpfte Task-ID' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], AddTimeEntryDto.prototype, "taskId", void 0);
__decorate([
    ApiProperty({ example: 2.5, minimum: 0.5, maximum: 24 }),
    IsNumber(),
    Min(0.5),
    Max(24),
    __metadata("design:type", Number)
], AddTimeEntryDto.prototype, "stunden", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Netzwerkkonfiguration konfiguriert' }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], AddTimeEntryDto.prototype, "kommentar", void 0);
export class BatchReviewDto {
    reportIds;
    entscheidung;
    kommentar;
}
__decorate([
    ApiProperty({ isArray: true, description: 'Report-IDs für Batch-Review' }),
    IsArray(),
    IsUUID('4', { each: true }),
    __metadata("design:type", Array)
], BatchReviewDto.prototype, "reportIds", void 0);
__decorate([
    ApiProperty({ enum: ['freigeben', 'zurueck'], example: 'freigeben' }),
    IsEnum(['freigeben', 'zurueck']),
    __metadata("design:type", String)
], BatchReviewDto.prototype, "entscheidung", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Bitte ergänzen Sie die fehlenden Abschnitte.' }),
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], BatchReviewDto.prototype, "kommentar", void 0);
export class VersionResponseDto {
    id;
    reportId;
    version;
    inhaltMarkdown;
    erstelltVon;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], VersionResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], VersionResponseDto.prototype, "reportId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], VersionResponseDto.prototype, "version", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], VersionResponseDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], VersionResponseDto.prototype, "erstelltVon", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], VersionResponseDto.prototype, "createdAt", void 0);
export class DiffResponseDto {
    v1;
    v2;
}
__decorate([
    ApiProperty({ description: 'Inhalt der älteren Version' }),
    __metadata("design:type", String)
], DiffResponseDto.prototype, "v1", void 0);
__decorate([
    ApiProperty({ description: 'Inhalt der neueren Version' }),
    __metadata("design:type", String)
], DiffResponseDto.prototype, "v2", void 0);
//# sourceMappingURL=report.dto.js.map