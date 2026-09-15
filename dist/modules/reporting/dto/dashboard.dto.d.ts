import { FruchwarnDto } from './reporting.dto.js';
export declare class AmpelStatusDto {
    gruen: number;
    gelb: number;
    rot: number;
}
export declare class OffeneBerichteDto {
    gesamt: number;
    ampel: AmpelStatusDto;
    aeltestesInTagen?: number;
}
export declare class HalbjahrTrendDto {
    halbjahr: string | null;
    fach: string | null;
    zeitraum: string;
    avgGewichtet: number;
    count: number;
}
export declare class NotenStatDto {
    anzahl: number;
    schnittGewichtet: number;
    schnittUngewichtet: number;
    halbjahrTrends: HalbjahrTrendDto[];
    fachTrends?: HalbjahrTrendDto[];
}
export declare class ProjektPipelineDto {
    entwurf: number;
    eingereicht: number;
    freigegeben: number;
    abgelehnt: number;
    archiviert: number;
    inPruefung?: number;
}
export declare class PruefungFristDto {
    id: string;
    typ: string;
    status: string;
    ihkTermin: Date | null;
    faelligInTagen: number | null;
    titel?: string;
}
export declare class OnboardingQuoteDto {
    gesamt: number;
    erledigt: number;
    quote: number;
}
export declare class BadgeProgressDto {
    gesamt: number;
    earned: number;
    naechstes?: string;
}
export declare class AnwesenheitQuoteDto {
    quote30d: number;
    fehlTage30d: number;
    quote90d?: number;
}
export declare class SkillCoverageSummaryDto {
    coverage: number;
    freigegeben: number;
    used: number;
}
export declare class AzubiDashboardDto {
    role: string;
    offeneBerichte: OffeneBerichteDto;
    skills: SkillCoverageSummaryDto;
    noten: NotenStatDto;
    projekte: ProjektPipelineDto;
    pruefungen: PruefungFristDto[];
    onboarding: OnboardingQuoteDto;
    badges: BadgeProgressDto;
    anwesenheit: AnwesenheitQuoteDto;
    foerderbedarfOffen: number;
    warnings: FruchwarnDto[];
    stats?: Record<string, number>;
}
export declare class BeauftragterDashboardDto {
    role: string;
    openVisa: number;
    visaAmpel: AmpelStatusDto;
    kommendeRotationen30d: number;
    kommendeRotationen90d: number;
    rotationen: Array<{
        azubiId: string;
        name: string;
        abteilung: string;
        von: Date;
    }>;
    gruppenNotenSchnitt: number;
    warnCount: number;
    foerderbedarfOffen: number;
    feedbackAvgFachkompetenz: number;
    feedbackAvgSoftskills: number;
    abwesenheiten30d: number;
    warnings: FruchwarnDto[];
    stats?: Record<string, number>;
}
export declare class AusbilderHrDashboardDto {
    role: string;
    azubiGesamt: number;
    berichtVerteilung: Record<string, number>;
    projektPipeline: ProjektPipelineDto;
    pruefungPipeline: Record<string, number>;
    foerderbedarf: Record<string, number>;
    onboarding: OnboardingQuoteDto;
    gamificationCoverage: number;
    abwesenheitRate: AnwesenheitQuoteDto;
    kapazitaetWarnungen: Array<{
        abteilungId: string;
        name: string;
        planAusbilder: number;
        istAzubis: number;
        status: string;
    }>;
    uebernahmePipeline?: Record<string, number>;
    alumniQuote?: Record<string, number>;
    notenSchnitt: number;
    warnings: FruchwarnDto[];
    stats?: Record<string, number>;
}
export type TypedDashboardResult = AzubiDashboardDto | BeauftragterDashboardDto | AusbilderHrDashboardDto;
