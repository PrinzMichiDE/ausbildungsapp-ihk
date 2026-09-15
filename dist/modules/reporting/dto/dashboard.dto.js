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
import { FruchwarnDto } from './reporting.dto.js';
export class AmpelStatusDto {
    gruen;
    gelb;
    rot;
}
__decorate([
    ApiProperty({ description: 'Grün ≤7 Tage' }),
    __metadata("design:type", Number)
], AmpelStatusDto.prototype, "gruen", void 0);
__decorate([
    ApiProperty({ description: 'Gelb 8-14 Tage' }),
    __metadata("design:type", Number)
], AmpelStatusDto.prototype, "gelb", void 0);
__decorate([
    ApiProperty({ description: 'Rot >14 Tage' }),
    __metadata("design:type", Number)
], AmpelStatusDto.prototype, "rot", void 0);
export class OffeneBerichteDto {
    gesamt;
    ampel;
    aeltestesInTagen;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], OffeneBerichteDto.prototype, "gesamt", void 0);
__decorate([
    ApiProperty({ type: AmpelStatusDto }),
    __metadata("design:type", AmpelStatusDto)
], OffeneBerichteDto.prototype, "ampel", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Ältester offener Bericht in Tagen' }),
    __metadata("design:type", Number)
], OffeneBerichteDto.prototype, "aeltestesInTagen", void 0);
export class HalbjahrTrendDto {
    halbjahr;
    fach;
    zeitraum;
    avgGewichtet;
    count;
}
__decorate([
    ApiProperty({ example: 'erstes', nullable: true }),
    __metadata("design:type", Object)
], HalbjahrTrendDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ example: 'Mathematik', nullable: true }),
    __metadata("design:type", Object)
], HalbjahrTrendDto.prototype, "fach", void 0);
__decorate([
    ApiProperty({ example: '2025/2026' }),
    __metadata("design:type", String)
], HalbjahrTrendDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty({ description: 'Gewichteter Durchschnitt' }),
    __metadata("design:type", Number)
], HalbjahrTrendDto.prototype, "avgGewichtet", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], HalbjahrTrendDto.prototype, "count", void 0);
export class NotenStatDto {
    anzahl;
    schnittGewichtet;
    schnittUngewichtet;
    halbjahrTrends;
    fachTrends;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], NotenStatDto.prototype, "anzahl", void 0);
__decorate([
    ApiProperty({ description: 'Gewichteter Schnitt SUM(note*gewichtung)/SUM(gewichtung)' }),
    __metadata("design:type", Number)
], NotenStatDto.prototype, "schnittGewichtet", void 0);
__decorate([
    ApiProperty({ description: 'Ungewichteter Schnitt' }),
    __metadata("design:type", Number)
], NotenStatDto.prototype, "schnittUngewichtet", void 0);
__decorate([
    ApiProperty({ type: [HalbjahrTrendDto] }),
    __metadata("design:type", Array)
], NotenStatDto.prototype, "halbjahrTrends", void 0);
__decorate([
    ApiPropertyOptional({ type: [HalbjahrTrendDto], description: 'Fach-Zeitreihe sortiert datum asc' }),
    __metadata("design:type", Array)
], NotenStatDto.prototype, "fachTrends", void 0);
export class ProjektPipelineDto {
    entwurf;
    eingereicht;
    freigegeben;
    abgelehnt;
    archiviert;
    inPruefung;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ProjektPipelineDto.prototype, "entwurf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ProjektPipelineDto.prototype, "eingereicht", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ProjektPipelineDto.prototype, "freigegeben", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ProjektPipelineDto.prototype, "abgelehnt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], ProjektPipelineDto.prototype, "archiviert", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Number)
], ProjektPipelineDto.prototype, "inPruefung", void 0);
export class PruefungFristDto {
    id;
    typ;
    status;
    ihkTermin;
    faelligInTagen;
    titel;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungFristDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ example: 'ap2' }),
    __metadata("design:type", String)
], PruefungFristDto.prototype, "typ", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungFristDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], PruefungFristDto.prototype, "ihkTermin", void 0);
__decorate([
    ApiProperty({ description: 'Tage bis Termin, negativ wenn überfällig' }),
    __metadata("design:type", Object)
], PruefungFristDto.prototype, "faelligInTagen", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", String)
], PruefungFristDto.prototype, "titel", void 0);
export class OnboardingQuoteDto {
    gesamt;
    erledigt;
    quote;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], OnboardingQuoteDto.prototype, "gesamt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], OnboardingQuoteDto.prototype, "erledigt", void 0);
__decorate([
    ApiProperty({ description: '0–1' }),
    __metadata("design:type", Number)
], OnboardingQuoteDto.prototype, "quote", void 0);
export class BadgeProgressDto {
    gesamt;
    earned;
    naechstes;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BadgeProgressDto.prototype, "gesamt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BadgeProgressDto.prototype, "earned", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Nächstes Badge Titel falls vorhanden' }),
    __metadata("design:type", String)
], BadgeProgressDto.prototype, "naechstes", void 0);
export class AnwesenheitQuoteDto {
    quote30d;
    fehlTage30d;
    quote90d;
}
__decorate([
    ApiProperty({ description: 'Quote 30 Tage 0–1' }),
    __metadata("design:type", Number)
], AnwesenheitQuoteDto.prototype, "quote30d", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AnwesenheitQuoteDto.prototype, "fehlTage30d", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Quote 90 Tage 0–1' }),
    __metadata("design:type", Number)
], AnwesenheitQuoteDto.prototype, "quote90d", void 0);
export class SkillCoverageSummaryDto {
    coverage;
    freigegeben;
    used;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillCoverageSummaryDto.prototype, "coverage", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillCoverageSummaryDto.prototype, "freigegeben", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillCoverageSummaryDto.prototype, "used", void 0);
export class AzubiDashboardDto {
    role;
    offeneBerichte;
    skills;
    noten;
    projekte;
    pruefungen;
    onboarding;
    badges;
    anwesenheit;
    foerderbedarfOffen;
    warnings;
    stats;
}
__decorate([
    ApiProperty({ example: 'azubi' }),
    __metadata("design:type", String)
], AzubiDashboardDto.prototype, "role", void 0);
__decorate([
    ApiProperty({ type: OffeneBerichteDto }),
    __metadata("design:type", OffeneBerichteDto)
], AzubiDashboardDto.prototype, "offeneBerichte", void 0);
__decorate([
    ApiProperty({ type: SkillCoverageSummaryDto }),
    __metadata("design:type", SkillCoverageSummaryDto)
], AzubiDashboardDto.prototype, "skills", void 0);
__decorate([
    ApiProperty({ type: NotenStatDto }),
    __metadata("design:type", NotenStatDto)
], AzubiDashboardDto.prototype, "noten", void 0);
__decorate([
    ApiProperty({ type: ProjektPipelineDto }),
    __metadata("design:type", ProjektPipelineDto)
], AzubiDashboardDto.prototype, "projekte", void 0);
__decorate([
    ApiProperty({ type: [PruefungFristDto] }),
    __metadata("design:type", Array)
], AzubiDashboardDto.prototype, "pruefungen", void 0);
__decorate([
    ApiProperty({ type: OnboardingQuoteDto }),
    __metadata("design:type", OnboardingQuoteDto)
], AzubiDashboardDto.prototype, "onboarding", void 0);
__decorate([
    ApiProperty({ type: BadgeProgressDto }),
    __metadata("design:type", BadgeProgressDto)
], AzubiDashboardDto.prototype, "badges", void 0);
__decorate([
    ApiProperty({ type: AnwesenheitQuoteDto }),
    __metadata("design:type", AnwesenheitQuoteDto)
], AzubiDashboardDto.prototype, "anwesenheit", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AzubiDashboardDto.prototype, "foerderbedarfOffen", void 0);
__decorate([
    ApiProperty({ type: [FruchwarnDto] }),
    __metadata("design:type", Array)
], AzubiDashboardDto.prototype, "warnings", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Legacy stats map für Abwärtskompatibilität' }),
    __metadata("design:type", Object)
], AzubiDashboardDto.prototype, "stats", void 0);
export class BeauftragterDashboardDto {
    role;
    openVisa;
    visaAmpel;
    kommendeRotationen30d;
    kommendeRotationen90d;
    rotationen;
    gruppenNotenSchnitt;
    warnCount;
    foerderbedarfOffen;
    feedbackAvgFachkompetenz;
    feedbackAvgSoftskills;
    abwesenheiten30d;
    warnings;
    stats;
}
__decorate([
    ApiProperty({ example: 'ausbildungsbeauftragter' }),
    __metadata("design:type", String)
], BeauftragterDashboardDto.prototype, "role", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "openVisa", void 0);
__decorate([
    ApiProperty({ type: AmpelStatusDto, description: 'Visa Alter Ampel' }),
    __metadata("design:type", AmpelStatusDto)
], BeauftragterDashboardDto.prototype, "visaAmpel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "kommendeRotationen30d", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "kommendeRotationen90d", void 0);
__decorate([
    ApiProperty({ type: [Object], description: 'Liste [{azubiId,name,abteilung,von}]' }),
    __metadata("design:type", Array)
], BeauftragterDashboardDto.prototype, "rotationen", void 0);
__decorate([
    ApiProperty({ description: 'Gruppen Notenschnitt gewichtet' }),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "gruppenNotenSchnitt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "warnCount", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "foerderbedarfOffen", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "feedbackAvgFachkompetenz", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "feedbackAvgSoftskills", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BeauftragterDashboardDto.prototype, "abwesenheiten30d", void 0);
__decorate([
    ApiProperty({ type: [FruchwarnDto] }),
    __metadata("design:type", Array)
], BeauftragterDashboardDto.prototype, "warnings", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", Object)
], BeauftragterDashboardDto.prototype, "stats", void 0);
export class AusbilderHrDashboardDto {
    role;
    azubiGesamt;
    berichtVerteilung;
    projektPipeline;
    pruefungPipeline;
    foerderbedarf;
    onboarding;
    gamificationCoverage;
    abwesenheitRate;
    kapazitaetWarnungen;
    uebernahmePipeline;
    alumniQuote;
    notenSchnitt;
    warnings;
    stats;
}
__decorate([
    ApiProperty({ example: 'ausbilder_hr' }),
    __metadata("design:type", String)
], AusbilderHrDashboardDto.prototype, "role", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AusbilderHrDashboardDto.prototype, "azubiGesamt", void 0);
__decorate([
    ApiProperty({ type: Object, description: 'Verteilung {entwurf, eingereicht, visiert, archiviert}' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "berichtVerteilung", void 0);
__decorate([
    ApiProperty({ type: ProjektPipelineDto }),
    __metadata("design:type", ProjektPipelineDto)
], AusbilderHrDashboardDto.prototype, "projektPipeline", void 0);
__decorate([
    ApiProperty({ type: Object, description: 'Prüfungspipeline {angemeldet,teilgenommen,bestanden,wiederholung}' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "pruefungPipeline", void 0);
__decorate([
    ApiProperty({ type: Object, description: 'Foerderbedarf {offen,erledigt,nachverfolgungFaellig}' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "foerderbedarf", void 0);
__decorate([
    ApiProperty({ type: OnboardingQuoteDto }),
    __metadata("design:type", OnboardingQuoteDto)
], AusbilderHrDashboardDto.prototype, "onboarding", void 0);
__decorate([
    ApiProperty({ description: 'Average badges per azubi' }),
    __metadata("design:type", Number)
], AusbilderHrDashboardDto.prototype, "gamificationCoverage", void 0);
__decorate([
    ApiProperty({ type: AnwesenheitQuoteDto }),
    __metadata("design:type", AnwesenheitQuoteDto)
], AusbilderHrDashboardDto.prototype, "abwesenheitRate", void 0);
__decorate([
    ApiProperty({ type: [Object], description: 'Kapazitätswarnungen [{abteilungId,name,planAusbilder,istAzubis,status}]' }),
    __metadata("design:type", Array)
], AusbilderHrDashboardDto.prototype, "kapazitaetWarnungen", void 0);
__decorate([
    ApiPropertyOptional({ type: Object, description: 'Nur HR: uebernahmePipeline' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "uebernahmePipeline", void 0);
__decorate([
    ApiPropertyOptional({ type: Object, description: 'Nur HR: alumniQuote' }),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "alumniQuote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AusbilderHrDashboardDto.prototype, "notenSchnitt", void 0);
__decorate([
    ApiProperty({ type: [FruchwarnDto] }),
    __metadata("design:type", Array)
], AusbilderHrDashboardDto.prototype, "warnings", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", Object)
], AusbilderHrDashboardDto.prototype, "stats", void 0);
//# sourceMappingURL=dashboard.dto.js.map