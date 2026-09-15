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
export var ZeitraumGranularitaet;
(function (ZeitraumGranularitaet) {
    ZeitraumGranularitaet["monat"] = "monat";
    ZeitraumGranularitaet["quartal"] = "quartal";
    ZeitraumGranularitaet["jahr"] = "jahr";
})(ZeitraumGranularitaet || (ZeitraumGranularitaet = {}));
export class ZeitraumQueryDto {
    jahrFrom;
    jahrTo;
    granularitaet;
    fach;
    halbjahr;
    abteilungId;
    beruf;
    azubiId;
    limit;
    offset;
    von;
    bis;
}
__decorate([
    ApiPropertyOptional({ description: 'Jahr von inkl.', example: '2023' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "jahrFrom", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Jahr bis inkl.', example: '2026' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "jahrTo", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Granularität', enum: ZeitraumGranularitaet }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "granularitaet", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Fach Filter' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "fach", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Halbjahr erstes|zweites' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "halbjahr", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Abteilung ID Filter' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "abteilungId", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Beruf Filter', enum: ['systemintegration', 'anwendungsentwicklung', 'daten_prozessanalyse', 'digitale_vernetzung'] }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "beruf", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Azubi ID Filter (nur wenn scope erlaubt)' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "azubiId", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Limit Pagination', example: '50' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "limit", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Offset Pagination', example: '0' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "offset", void 0);
__decorate([
    ApiPropertyOptional({ description: 'von ISO Datum für Zeitreihe' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "von", void 0);
__decorate([
    ApiPropertyOptional({ description: 'bis ISO Datum für Zeitreihe' }),
    __metadata("design:type", String)
], ZeitraumQueryDto.prototype, "bis", void 0);
export class SkillGapDto {
    lernfeld;
    frameworkId;
    frameworkTitel;
    tasksTotal;
    reportsUsing;
    coverage;
    istStunden;
    prioritaet;
    fehlendeTasks;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapDto.prototype, "lernfeld", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapDto.prototype, "frameworkId", void 0);
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
    ApiProperty({ description: '0–1' }),
    __metadata("design:type", Number)
], SkillGapDto.prototype, "coverage", void 0);
__decorate([
    ApiProperty({ description: 'Summe Stunden via ReportTimeEntry' }),
    __metadata("design:type", Number)
], SkillGapDto.prototype, "istStunden", void 0);
__decorate([
    ApiProperty({ description: 'hoch <30% | mittel 30-70% | niedrig >70%' }),
    __metadata("design:type", String)
], SkillGapDto.prototype, "prioritaet", void 0);
__decorate([
    ApiProperty({ type: [String], description: 'Fehlende Tasks Titel' }),
    __metadata("design:type", Array)
], SkillGapDto.prototype, "fehlendeTasks", void 0);
export class CourseCompletionDto {
    courseId;
    courseTitle;
    frameworkTitel;
    tasksTotal;
    completionRate;
    completionRateAzubi;
    completionRateAbteilung;
    avgTage;
    medianTage;
    tasks;
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
    ApiProperty(),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "tasksTotal", void 0);
__decorate([
    ApiProperty({ description: 'Completion Rate 0–1 pro sichtbare Azubis' }),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "completionRate", void 0);
__decorate([
    ApiProperty({ description: 'Completion Rate azubi-spezifisch wenn scoped' }),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "completionRateAzubi", void 0);
__decorate([
    ApiProperty({ description: 'Completion Rate abteilung falls verfügbar' }),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "completionRateAbteilung", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Ø Tage bis Completion' }),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "avgTage", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Median Tage bis Completion' }),
    __metadata("design:type", Number)
], CourseCompletionDto.prototype, "medianTage", void 0);
__decorate([
    ApiProperty({ type: [Object], description: 'Tasks [{titel, usedCount}]' }),
    __metadata("design:type", Array)
], CourseCompletionDto.prototype, "tasks", void 0);
export class QualitaetsScoreVerteilungDto {
    avg;
    histogram;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], QualitaetsScoreVerteilungDto.prototype, "avg", void 0);
__decorate([
    ApiProperty({ description: 'Histogram {0-50,51-70,71-85,86-100}' }),
    __metadata("design:type", Object)
], QualitaetsScoreVerteilungDto.prototype, "histogram", void 0);
export class NotenTrendDto {
    halbjahr;
    fach;
    zeitraum;
    avgGewichtet;
    avgUngewichtet;
    count;
    datum;
}
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], NotenTrendDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], NotenTrendDto.prototype, "fach", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], NotenTrendDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenTrendDto.prototype, "avgGewichtet", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenTrendDto.prototype, "avgUngewichtet", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenTrendDto.prototype, "count", void 0);
__decorate([
    ApiProperty({ type: Date, nullable: true }),
    __metadata("design:type", Object)
], NotenTrendDto.prototype, "datum", void 0);
export class NotenVerteilungDto {
    histogram;
    gesamt;
    avgGewichtet;
    avgUngewichtet;
}
__decorate([
    ApiProperty({ description: 'Histogram 1.x-6.x' }),
    __metadata("design:type", Object)
], NotenVerteilungDto.prototype, "histogram", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "gesamt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "avgGewichtet", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenVerteilungDto.prototype, "avgUngewichtet", void 0);
export class NotenTrendResponseDto {
    trend;
    verlauf;
    verteilung;
}
__decorate([
    ApiProperty({ type: [NotenTrendDto] }),
    __metadata("design:type", Array)
], NotenTrendResponseDto.prototype, "trend", void 0);
__decorate([
    ApiProperty({ type: [NotenTrendDto] }),
    __metadata("design:type", Array)
], NotenTrendResponseDto.prototype, "verlauf", void 0);
__decorate([
    ApiProperty({ type: NotenVerteilungDto }),
    __metadata("design:type", NotenVerteilungDto)
], NotenTrendResponseDto.prototype, "verteilung", void 0);
export class ZeitreiheDto {
    periode;
    reportQuoteAvg;
    kompetenzCoverageAvg;
    notenSchnitt;
    azubiCount;
}
__decorate([
    ApiProperty({ example: '2025-Q1' }),
    __metadata("design:type", String)
], ZeitreiheDto.prototype, "periode", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "reportQuoteAvg", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "kompetenzCoverageAvg", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "notenSchnitt", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", Number)
], ZeitreiheDto.prototype, "azubiCount", void 0);
export class KohortenBasisDto {
    jahr;
    beruf;
    azubiCount;
    avgNotenSchnitt;
    avgReportQuote;
    avgKompetenzCoverage;
    alumniCount;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenBasisDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty({ example: 'systemintegration', nullable: true }),
    __metadata("design:type", Object)
], KohortenBasisDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenBasisDto.prototype, "azubiCount", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenBasisDto.prototype, "avgNotenSchnitt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenBasisDto.prototype, "avgReportQuote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenBasisDto.prototype, "avgKompetenzCoverage", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Anzahl Alumni in Kohorte' }),
    __metadata("design:type", Number)
], KohortenBasisDto.prototype, "alumniCount", void 0);
export class KohortenVergleichDto {
    jahr;
    beruf;
    azubiCount;
    avgNotenSchnitt;
    avgReportQuote;
    avgKompetenzCoverage;
    avgAbbruchquote;
    avgZufriedenheit;
    trend;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], KohortenVergleichDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "azubiCount", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "avgNotenSchnitt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "avgReportQuote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "avgKompetenzCoverage", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "avgAbbruchquote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], KohortenVergleichDto.prototype, "avgZufriedenheit", void 0);
__decorate([
    ApiProperty({ type: Object, description: 'Trend vs Vorjahr {notenSchnittDelta, reportQuoteDelta}' }),
    __metadata("design:type", Object)
], KohortenVergleichDto.prototype, "trend", void 0);
export class WarnFilterQueryDto {
    kategorie;
    fach;
    severity;
}
__decorate([
    ApiPropertyOptional({ description: 'Kategorie filter', example: 'note_fruehwarnung' }),
    __metadata("design:type", String)
], WarnFilterQueryDto.prototype, "kategorie", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Fach filter' }),
    __metadata("design:type", String)
], WarnFilterQueryDto.prototype, "fach", void 0);
__decorate([
    ApiPropertyOptional({ enum: ['gut', 'warnung', 'kritisch'], description: 'Severity filter' }),
    __metadata("design:type", String)
], WarnFilterQueryDto.prototype, "severity", void 0);
//# sourceMappingURL=kpi.dto.js.map