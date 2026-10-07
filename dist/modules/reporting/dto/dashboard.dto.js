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
import { IsOptional, IsString } from 'class-validator';
import { Halbjahr } from '@prisma/client';
import { WarnTyp } from './reporting.dto.js';
export class AzubiDashboardDto {
    role;
    offeneBerichte;
    skillCoverage;
    noten;
    projekte;
    pruefungen;
    onboarding;
    badges;
    anwesenheit;
    foerderbedarfOffen;
    stats;
    warnings;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AzubiDashboardDto.prototype, "role", void 0);
__decorate([
    ApiProperty({ description: 'Offene Berichte nach Ampel' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "offeneBerichte", void 0);
__decorate([
    ApiProperty({ description: 'Skill Matrix Coverage' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "skillCoverage", void 0);
__decorate([
    ApiProperty({ description: 'Noten-Zeitreihe' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "noten", void 0);
__decorate([
    ApiProperty({ description: 'Projekte-Pipeline' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "projekte", void 0);
__decorate([
    ApiProperty({ description: 'Pruefungen' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "pruefungen", void 0);
__decorate([
    ApiProperty({ description: 'Onboarding' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "onboarding", void 0);
__decorate([
    ApiProperty({ description: 'Badges' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "badges", void 0);
__decorate([
    ApiProperty({ description: 'Abwesenheit' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "anwesenheit", void 0);
__decorate([
    ApiProperty({ description: 'Foerderbedarf offen' }),
    __metadata("design:type", Number)
], AzubiDashboardDto.prototype, "foerderbedarfOffen", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "stats", void 0);
__decorate([
    ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } }),
    __metadata("design:type", Array)
], AzubiDashboardDto.prototype, "warnings", void 0);
export class BeauftragterDashboardDto {
    role;
    offeneVisa;
    rotationen;
    skillCoverage;
    noten;
    foerderbedarfOffen;
    feedback;
    abwesenheiten;
    stats;
    warnings;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BeauftragterDashboardDto.prototype, "role", void 0);
__decorate([
    ApiProperty({ description: 'Visa-Antraege nach Ampel' }),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "offeneVisa", void 0);
__decorate([
    ApiProperty({ description: 'Rotationen' }),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "rotationen", void 0);
__decorate([
    ApiProperty({ description: 'Skill Coverage nur scoped' }),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "skillCoverage", void 0);
__decorate([
    ApiProperty({ description: 'Noten statistisch' }),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "noten", void 0);
__decorate([
    ApiProperty({ description: 'Foerderbedarf offen' }),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "foerderbedarfOffen", void 0);
__decorate([
    ApiProperty({ description: 'Feedback' }),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "feedback", void 0);
__decorate([
    ApiProperty({ description: 'Abwesenheiten Abteilung' }),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "abwesenheiten", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "stats", void 0);
__decorate([
    ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } }),
    __metadata("design:type", Array)
], BeauftragterDashboardDto.prototype, "warnings", void 0);
export class AusbilderHrDashboardDto {
    role;
    berichtVerteilung;
    projektPipeline;
    pruefungPipeline;
    foerderbedarf;
    onboardingQuote;
    gamificationCoverage;
    abwesenheitRate;
    kapazitaetWarnung;
    uebernahmePipeline;
    alumni;
    stats;
    warnings;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbilderHrDashboardDto.prototype, "role", void 0);
__decorate([
    ApiProperty({ description: 'Berichtsheft-Verteilung' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "berichtVerteilung", void 0);
__decorate([
    ApiProperty({ description: 'Projekt-Pipeline' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "projektPipeline", void 0);
__decorate([
    ApiProperty({ description: 'Pruefung-Pipeline' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "pruefungPipeline", void 0);
__decorate([
    ApiProperty({ description: 'Foerderbedarf' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "foerderbedarf", void 0);
__decorate([
    ApiProperty({ description: 'Onboarding Coverage' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "onboardingQuote", void 0);
__decorate([
    ApiProperty({ description: 'Gamification' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "gamificationCoverage", void 0);
__decorate([
    ApiProperty({ description: 'Abwesenheitsrate' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "abwesenheitRate", void 0);
__decorate([
    ApiProperty({ description: 'Kapazitaetswarnungen' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "kapazitaetWarnung", void 0);
__decorate([
    ApiProperty({ description: 'HR-spezifische Daten' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "uebernahmePipeline", void 0);
__decorate([
    ApiProperty({ description: 'Alumni-Statistiken' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "alumni", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "stats", void 0);
__decorate([
    ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } }),
    __metadata("design:type", Array)
], AusbilderHrDashboardDto.prototype, "warnings", void 0);
export class SkillGapDto {
    lernfeld;
    frameworkTitel;
    tasksTotal;
    reportsUsing;
    coverage;
    istStunden;
    fehlendeTasks;
    priorität;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapDto.prototype, "lernfeld", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapDto.prototype, "frameworkTitel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillGapDto.prototype, "tasksTotal", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillGapDto.prototype, "reportsUsing", void 0);
__decorate([
    ApiProperty({ description: '0-1' }),
    __metadata("design:type", Number)
], SkillGapDto.prototype, "coverage", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillGapDto.prototype, "istStunden", void 0);
__decorate([
    ApiProperty({ description: 'Fehlende Tasks' }),
    __metadata("design:type", Array)
], SkillGapDto.prototype, "fehlendeTasks", void 0);
__decorate([
    ApiProperty({ description: 'Priorität' }),
    __metadata("design:type", String)
], SkillGapDto.prototype, "priorit\u00E4t", void 0);
export class NotenTrendDto {
    halbjahr;
    fach;
    zeitraum;
    schnittGewichtet;
    noteCount;
}
__decorate([
    ApiProperty(),
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
    ApiProperty(),
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
    avgAbbruchquote;
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
], KohortenDto.prototype, "avgAbbruchquote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "trendNotenSchnitt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenDto.prototype, "trendReportQuote", void 0);
export class CourseCompletionDto {
    courseId;
    courseTitle;
    frameworkTitel;
    completionRate;
    timeToCompletion;
    qualitaetsScoreDistribution;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CourseCompletionDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CourseCompletionDto.prototype, "courseTitle", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CourseCompletionDto.prototype, "frameworkTitel", void 0);
__decorate([
    ApiProperty({ description: '0-1' }),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "completionRate", void 0);
__decorate([
    ApiProperty({ description: 'Time to completion in days' }),
    __metadata("design:type", Object)
], CourseCompletionDto.prototype, "timeToCompletion", void 0);
__decorate([
    ApiProperty({ description: 'Qualitäts-Score Verteilung' }),
    __metadata("design:type", Object)
], CourseCompletionDto.prototype, "qualitaetsScoreDistribution", void 0);
export class AlertConfigDto {
    id;
    userId;
    typ;
    schwelle;
    aktiv;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AlertConfigDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AlertConfigDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ enum: WarnTyp }),
    __metadata("design:type", String)
], AlertConfigDto.prototype, "typ", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], AlertConfigDto.prototype, "schwelle", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], AlertConfigDto.prototype, "aktiv", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AlertConfigDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AlertConfigDto.prototype, "updatedAt", void 0);
export class CustomReportDto {
    id;
    name;
    createdBy;
    metrics;
    timeframe;
    visualizations;
    filters;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CustomReportDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CustomReportDto.prototype, "name", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CustomReportDto.prototype, "createdBy", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Array)
], CustomReportDto.prototype, "metrics", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], CustomReportDto.prototype, "timeframe", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Array)
], CustomReportDto.prototype, "visualizations", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], CustomReportDto.prototype, "filters", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], CustomReportDto.prototype, "createdAt", void 0);
export class DashboardResult {
    role;
    stats;
    warnings;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], DashboardResult.prototype, "role", void 0);
__decorate([
    ApiProperty({ type: 'object', additionalProperties: { type: 'number' } }),
    __metadata("design:type", Object)
], DashboardResult.prototype, "stats", void 0);
__decorate([
    ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } }),
    __metadata("design:type", Array)
], DashboardResult.prototype, "warnings", void 0);
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
//# sourceMappingURL=dashboard.dto.js.map