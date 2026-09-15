import { ReportStatus } from '@prisma/client';
export declare class ReportQuoteDto {
    azubiId: string;
    name: string;
    year: number;
    kalenderwochen: number;
    eingereicht: number;
    quote: number;
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
export declare enum WarnSeverity {
    gut = "gut",
    warnung = "warnung",
    kritisch = "kritisch"
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
export declare class FruchwarnDto {
    azubiId: string;
    name: string;
    type: string;
    details: string;
    severity?: WarnSeverity;
    fach?: string;
}
export interface DashboardResult {
    role: string;
    stats: Record<string, number>;
    warnings: FruchwarnDto[];
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
export declare class ExportQueryDto {
    status?: ReportStatus;
    jahr?: string;
    format?: string;
    noCache?: string;
    fach?: string;
    abteilungId?: string;
}
export declare class ExportKindDto {
    kind: ReportingExportKind;
}
export declare class ZeitraumDto {
    von?: string;
    bis?: string;
    halbjahr?: string;
}
export declare function toCsv(rows: ReadonlyArray<Record<string, unknown>>): string;
