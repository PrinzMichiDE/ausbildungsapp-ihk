var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Halbjahr, ReportStatus } from '@prisma/client';
export class DashboardResult {
    role;
    stats;
    warnings;
}
__decorate([
    ApiProperty({ description: 'Rollenbasierte Dashboard-Daten' }),
    __metadata("design:type", String)
], DashboardResult.prototype, "role", void 0);
__decorate([
    ApiProperty({ description: 'KPI-Statistiken' }),
    __metadata("design:type", Object)
], DashboardResult.prototype, "stats", void 0);
__decorate([
    ApiProperty({ description: 'Frühwarnungen und Warnungen' }),
    __metadata("design:type", Array)
], DashboardResult.prototype, "warnings", void 0);
export class SkillCoverageDto {
    courseId;
    courseTitle;
    frameworkTitel;
    tasksTotal;
    reportsUsing;
    coverage;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillCoverageDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillCoverageDto.prototype, "courseTitle", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillCoverageDto.prototype, "frameworkTitel", void 0);
__decorate([
    ApiProperty({ description: '0–1' }),
    __metadata("design:type", Number)
], SkillCoverageDto.prototype, "tasksTotal", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillCoverageDto.prototype, "reportsUsing", void 0);
__decorate([
    ApiProperty({ description: '0–1' }),
    __metadata("design:type", Number)
], SkillCoverageDto.prototype, "coverage", void 0);
export class AbteilungsZufriedenheitDto {
    abteilungId;
    name;
    count;
    avgFachkompetenz;
    avgSoftskills;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AbteilungsZufriedenheitDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AbteilungsZufriedenheitDto.prototype, "name", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AbteilungsZufriedenheitDto.prototype, "count", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AbteilungsZufriedenheitDto.prototype, "avgFachkompetenz", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AbteilungsZufriedenheitDto.prototype, "avgSoftskills", void 0);
export class NotenTrendDto {
    halbjahr;
    fach;
    zeitraum;
    schnittGewichtet;
    noteCount;
}
__decorate([
    ApiProperty({ enum: Halbjahr }),
    __metadata("design:type", String)
], NotenTrendDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotenTrendDto.prototype, "fach", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotenTrendDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenTrendDto.prototype, "schnittGewichtet", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenTrendDto.prototype, "noteCount", void 0);
export class NotenVerteilungDto {
    note1;
    note2;
    note3;
    note4;
    note5;
    note6;
}
__decorate([
    ApiProperty({ description: 'Noten-Verteilung von 1–6' }),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "note1", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "note2", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "note3", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "note4", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "note5", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "note6", void 0);
export class ZeitreiheDto {
    periode;
    reportQuoteAvg;
    kompetenzCoverageAvg;
    notenSchnitt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ZeitreiheDto.prototype, "periode", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "reportQuoteAvg", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "kompetenzCoverageAvg", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "notenSchnitt", void 0);
export class KohortenDto {
    jahr;
    beruf;
    azubiCount;
    avgNotenSchnittGewichtet;
    avgReportQuote;
    avgKompetenzCoverage;
    trendNotenSchnitt;
    trendReportQuote;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], KohortenDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "azubiCount", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "avgNotenSchnittGewichtet", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "avgReportQuote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "avgKompetenzCoverage", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "trendNotenSchnitt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "trendReportQuote", void 0);
export class FruchwarnDto {
    azubiId;
    name;
    type;
    details;
    severity;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FruchwarnDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FruchwarnDto.prototype, "name", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FruchwarnDto.prototype, "type", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FruchwarnDto.prototype, "details", void 0);
__decorate([
    ApiProperty({ description: 'Schwäche der Warnung' }),
    __metadata("design:type", String)
], FruchwarnDto.prototype, "severity", void 0);
export class ReportQuoteDto {
    azubiId;
    name;
    year;
    kalenderwochen;
    eingereicht;
    quote;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ReportQuoteDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ReportQuoteDto.prototype, "name", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ReportQuoteDto.prototype, "year", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ReportQuoteDto.prototype, "kalenderwochen", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ReportQuoteDto.prototype, "eingereicht", void 0);
__decorate([
    ApiProperty({ description: '0–1' }),
    __metadata("design:type", Number)
], ReportQuoteDto.prototype, "quote", void 0);
export var WarnTyp;
(function (WarnTyp) {
    WarnTyp["note_fruehwarnung"] = "note_fruehwarnung";
    WarnTyp["fehlende_berichte"] = "fehlende_berichte";
    WarnTyp["foerderbedarf"] = "foerderbedarf";
    WarnTyp["pruefung_frist"] = "pruefung_frist";
    WarnTyp["onboarding_rueckstand"] = "onboarding_rueckstand";
    WarnTyp["kapazitaet"] = "kapazitaet";
    WarnTyp["fehlende_aufgaben"] = "fehlende_aufgaben";
})(WarnTyp || (WarnTyp = {}));
export var ReportingExportKind;
(function (ReportingExportKind) {
    ReportingExportKind["attendance"] = "attendance";
    ReportingExportKind["grades"] = "grades";
    ReportingExportKind["competency"] = "competency";
    ReportingExportKind["noten_trend"] = "noten_trend";
    ReportingExportKind["skill_gap"] = "skill_gap";
    ReportingExportKind["kohorten"] = "kohorten";
    ReportingExportKind["warnliste"] = "warnliste";
    ReportingExportKind["course_completion"] = "course_completion";
    ReportingExportKind["zeitreihe"] = "zeitreihe";
})(ReportingExportKind || (ReportingExportKind = {}));
export class ExportKindDto {
    kind;
}
__decorate([
    ApiProperty({ enum: ReportingExportKind }),
    IsEnum(ReportingExportKind),
    __metadata("design:type", String)
], ExportKindDto.prototype, "kind", void 0);
export class ExportQueryDto {
    status;
    jahr;
    format;
    noCache;
    fach;
    abteilungId;
}
__decorate([
    ApiPropertyOptional({ enum: ReportStatus }),
    IsOptional(),
    IsEnum(ReportStatus),
    __metadata("design:type", String)
], ExportQueryDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Jahr' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExportQueryDto.prototype, "jahr", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Format csv|json|pdf', example: 'csv' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExportQueryDto.prototype, "format", void 0);
__decorate([
    ApiPropertyOptional({ description: 'noCache=true bypass cache' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExportQueryDto.prototype, "noCache", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Fach filter' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExportQueryDto.prototype, "fach", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Abteilung filter' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ExportQueryDto.prototype, "abteilungId", void 0);
export class ZeitraumDto {
    von;
    bis;
    halbjahr;
}
__decorate([
    ApiPropertyOptional({ description: 'von ISO Datum' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ZeitraumDto.prototype, "von", void 0);
__decorate([
    ApiPropertyOptional({ description: 'bis ISO Datum' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ZeitraumDto.prototype, "bis", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Halbjahr' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ZeitraumDto.prototype, "halbjahr", void 0);
export function toCsv(rows) {
    if (rows.length === 0) {
        return '';
    }
    const headers = Object.keys(rows[0]);
    const escape = (value) => {
        const str = value === null || value === undefined ? '' : String(value);
        if (/[",\n\r]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    const lines = [
        headers.join(','),
        ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
    ];
    return lines.join('\r\n');
}
//# sourceMappingURL=reporting.dto.js.map