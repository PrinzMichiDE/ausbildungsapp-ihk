export declare enum ZeitraumGranularitaet {
    monat = "monat",
    quartal = "quartal",
    jahr = "jahr"
}
export declare class ZeitraumQueryDto {
    jahrFrom?: string;
    jahrTo?: string;
    granularitaet?: ZeitraumGranularitaet;
    fach?: string;
    halbjahr?: string;
    abteilungId?: string;
    beruf?: string;
    azubiId?: string;
    limit?: string;
    offset?: string;
    von?: string;
    bis?: string;
}
export declare class SkillGapDto {
    lernfeld: string;
    frameworkId: string;
    frameworkTitel: string;
    tasksTotal: number;
    reportsUsing: number;
    coverage: number;
    istStunden: number;
    prioritaet: string;
    fehlendeTasks: string[];
}
export declare class CourseCompletionDto {
    courseId: string;
    courseTitle: string;
    frameworkTitel: string;
    tasksTotal: number;
    completionRate: number;
    completionRateAzubi: number;
    completionRateAbteilung: number;
    avgTage?: number;
    medianTage?: number;
    tasks: Array<{
        titel: string;
        usedCount: number;
    }>;
}
export declare class QualitaetsScoreVerteilungDto {
    avg: number;
    histogram: Record<string, number>;
}
export declare class NotenTrendDto {
    halbjahr: string | null;
    fach: string | null;
    zeitraum: string;
    avgGewichtet: number;
    avgUngewichtet: number;
    count: number;
    datum: Date | null;
}
export declare class NotenVerteilungDto {
    histogram: Record<string, number>;
    gesamt: number;
    avgGewichtet: number;
    avgUngewichtet: number;
}
export declare class NotenTrendResponseDto {
    trend: NotenTrendDto[];
    verlauf: NotenTrendDto[];
    verteilung: NotenVerteilungDto;
}
export declare class ZeitreiheDto {
    periode: string;
    reportQuoteAvg?: number;
    kompetenzCoverageAvg?: number;
    notenSchnitt?: number;
    azubiCount?: number;
}
export declare class KohortenBasisDto {
    jahr: number;
    beruf: string | null;
    azubiCount: number;
    avgNotenSchnitt: number;
    avgReportQuote: number;
    avgKompetenzCoverage: number;
    alumniCount?: number;
}
export declare class KohortenVergleichDto {
    jahr: number;
    beruf: string | null;
    azubiCount: number;
    avgNotenSchnitt: number;
    avgReportQuote: number;
    avgKompetenzCoverage: number;
    avgAbbruchquote: number;
    avgZufriedenheit: number;
    trend: Record<string, number>;
}
export declare class WarnFilterQueryDto {
    kategorie?: string;
    fach?: string;
    severity?: string;
}
