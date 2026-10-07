import { Halbjahr, ReportStatus } from '@prisma/client';
export declare class DashboardResult {
    role: string;
    stats: Record<string, number>;
    warnings: any[];
}
export declare class SkillCoverageDto {
    courseId: string;
    courseTitle: string;
    frameworkTitel: string;
    tasksTotal: number;
    reportsUsing: number;
    coverage: number;
}
export declare class AbteilungsZufriedenheitDto {
    abteilungId: string;
    name: string;
    count: number;
    avgFachkompetenz: number;
    avgSoftskills: number;
}
export declare class NotenTrendDto {
    halbjahr: Halbjahr;
    fach: string;
    zeitraum: string;
    schnittGewichtet: number;
    noteCount: number;
}
export declare class NotenVerteilungDto {
    note1: number;
    note2: number;
    note3: number;
    note4: number;
    note5: number;
    note6: number;
}
export declare class ZeitreiheDto {
    periode: string;
    reportQuoteAvg: number;
    kompetenzCoverageAvg: number;
    notenSchnitt: number;
}
export declare class KohortenDto {
    jahr: number;
    beruf: string;
    azubiCount: number;
    avgNotenSchnittGewichtet: number;
    avgReportQuote: number;
    avgKompetenzCoverage: number;
    trendNotenSchnitt: number;
    trendReportQuote: number;
}
export declare class FruchwarnDto {
    azubiId: string;
    name: string;
    type: string;
    details: string;
    severity?: string;
}
export declare class ReportQuoteDto {
    azubiId: string;
    name: string;
    year: number;
    kalenderwochen: number;
    eingereicht: number;
    quote: number;
}
export declare enum WarnTyp {
    note_fruehwarnung = "note_fruehwarnung",
    fehlende_berichte = "fehlende_berichte",
    foerderbedarf = "foerderbedarf",
    pruefung_frist = "pruefung_frist",
    onboarding_rueckstand = "onboarding_rueckstand",
    kapazitaet = "kapazitaet",
    fehlende_aufgaben = "fehlende_aufgaben"
}
export declare enum ReportingExportKind {
    attendance = "attendance",
    grades = "grades",
    competency = "competency",
    noten_trend = "noten_trend",
    skill_gap = "skill_gap",
    kohorten = "kohorten",
    warnliste = "warnliste",
    course_completion = "course_completion",
    zeitreihe = "zeitreihe"
}
export declare class ExportKindDto {
    kind: ReportingExportKind;
}
export declare class ExportQueryDto {
    status?: ReportStatus;
    jahr?: string;
    format?: string;
    noCache?: string;
    fach?: string;
    abteilungId?: string;
}
export declare class ZeitraumDto {
    von?: string;
    bis?: string;
    halbjahr?: string;
}
export declare function toCsv(rows: ReadonlyArray<Record<string, unknown>>): string;
