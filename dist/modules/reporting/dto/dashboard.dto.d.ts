import { Halbjahr } from '@prisma/client';
import { WarnTyp } from './reporting.dto.js';
export declare class AzubiDashboardDto {
    role: 'azubi';
    offeneBerichte: {
        gesamt: number;
        ampel: {
            gruen: number;
            gelb: number;
            rot: number;
        };
    };
    skillCoverage: {
        frei: number;
        used: number;
        coverage: number;
    };
    noten: {
        anzahl: number;
        schnittGewichtet: number;
        halbjahrTrends: {
            halbjahr: Halbjahr;
            schnitt: number;
            fach: string;
        }[];
        verteilung: {
            note1: number;
            note2: number;
            note3: number;
            note4: number;
            note5: number;
            note6: number;
        };
    };
    projekte: {
        entwurf: number;
        eingereicht: number;
        freigegeben: number;
        abgelehnt: number;
    };
    pruefungen: {
        naechsteFristen: {
            id: string;
            typ: string;
            frist: Date;
            status: string;
        }[];
    };
    onboarding: {
        erledigt: number;
        quote: number;
        naechstes: string;
    };
    badges: {
        gesamt: number;
        naechstes: string;
    };
    anwesenheit: {
        quote30d: number;
        fehlTage30d: number;
    };
    foerderbedarfOffen: number;
    stats: Record<string, number>;
    warnings: any[];
}
export declare class BeauftragterDashboardDto {
    role: 'ausbildungsbeauftragter';
    offeneVisa: {
        gesamt: number;
        ampel: {
            gruen: number;
            gelb: number;
            rot: number;
        };
    };
    rotationen: {
        naechste30d: number;
        naechste90d: number;
        liste: {
            azubiId: string;
            name: string;
            abteilung: string;
            von: Date;
            bis: Date;
        }[];
    };
    skillCoverage: {
        courses: {
            courseId: string;
            courseTitle: string;
            used: number;
            total: number;
            coverage: number;
        }[];
    };
    noten: {
        schnittGewichtet: number;
        verteilung: {
            note1: number;
            note2: number;
            note3: number;
            note4: number;
            note5: number;
            note6: number;
        };
    };
    foerderbedarfOffen: number;
    feedback: {
        abteilung: {
            abteilungId: string;
            avgFachkompetenz: number;
            avgSoftskills: number;
        }[];
    };
    abwesenheiten: {
        count30d: number;
    };
    stats: Record<string, number>;
    warnings: any[];
}
export declare class AusbilderHrDashboardDto {
    role: 'ausbilder' | 'hr';
    berichtVerteilung: {
        entwurf: number;
        eingereicht: number;
        visiert: number;
        archiviert: number;
    };
    projektPipeline: {
        entwurf: number;
        eingereicht: number;
        freigegeben: number;
        abgelehnt: number;
    };
    pruefungPipeline: {
        angemeldet: number;
        teilgenommen: number;
        bestanden: number;
        wiederholung: number;
    };
    foerderbedarf: {
        offen: number;
        erledigt: number;
        nachverfolgungFaellig: number;
    };
    onboardingQuote: {
        erledigt: number;
        gesamt: number;
    };
    gamificationCoverage: {
        badgesAvg: number;
        topBadgeCount: number;
    };
    abwesenheitRate: {
        rate30d: number;
        rate90d: number;
    };
    kapazitaetWarnung: {
        abteilungen: {
            abteilungId: string;
            name: string;
            planAusbilder: number;
            istAusbilder: number;
            status: 'OK' | 'WARNUNG' | 'KRITISCH';
        }[];
    };
    uebernahmePipeline: {
        geplant: number;
        geblockt: number;
        abgeschlossen: number;
        widerrufen: number;
    };
    alumni: {
        ausgetreten30d: number;
        loeschungFaellig: number;
    };
    stats: Record<string, number>;
    warnings: any[];
}
export declare class SkillGapDto {
    lernfeld: string;
    frameworkTitel: string;
    tasksTotal: number;
    reportsUsing: number;
    coverage: number;
    istStunden: number;
    fehlendeTasks: string[];
    priorität: 'hoch' | 'mittel' | 'niedrig';
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
    avgAbbruchquote: number;
    trendNotenSchnitt: number;
    trendReportQuote: number;
}
export declare class CourseCompletionDto {
    courseId: string;
    courseTitle: string;
    frameworkTitel: string;
    completionRate: number;
    timeToCompletion: {
        avg: number;
        median: number;
    };
    qualitaetsScoreDistribution: {
        avg: number;
        histogram: {
            range0_50: number;
            range51_70: number;
            range71_85: number;
            range86_100: number;
        };
    };
}
export declare class AlertConfigDto {
    id: string;
    userId: string;
    typ: WarnTyp;
    schwelle: Record<string, unknown>;
    aktiv: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CustomReportDto {
    id: string;
    name: string;
    createdBy: string;
    metrics: string[];
    timeframe: {
        von?: string;
        bis?: string;
        halbjahr?: string;
    };
    visualizations: string[];
    filters: {
        abteilungId?: string;
        beruf?: string;
        halbjahr?: string;
    };
    createdAt: Date;
}
export declare class DashboardResult {
    role: string;
    stats: Record<string, number>;
    warnings: any[];
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
export declare class ZeitraumDto {
    von?: string;
    bis?: string;
    halbjahr?: string;
}
export declare function toCsv(rows: ReadonlyArray<Record<string, unknown>>): string;
