import { ReportStatus, ReportTyp } from '@prisma/client';
export declare class CreateReportDto {
    titel: string;
    typ: ReportTyp;
    kalenderwoche: number;
    jahr: number;
    datumVon: string;
    datumBis: string;
    inhaltMarkdown: string;
    taskIds?: string[];
}
export declare class UpdateReportDto {
    titel?: string;
    typ?: ReportTyp;
    kalenderwoche?: number;
    jahr?: number;
    datumVon?: string;
    datumBis?: string;
    inhaltMarkdown?: string;
    taskIds?: string[];
}
export declare class ReviewReportDto {
    entscheidung: 'freigeben' | 'zurueck';
    kommentar?: string;
}
export declare class AddCommentDto {
    text: string;
    art?: KommentarArt;
}
export declare class ReportResponseDto {
    id: string;
    azubiId: string;
    titel: string;
    typ: ReportTyp;
    kalenderwoche: number;
    jahr: number;
    datumVon: Date;
    datumBis: Date;
    inhaltMarkdown: string;
    status: ReportStatus;
    signiertVon: string | null;
    signiertAm: Date | null;
    archiviertAm: Date | null;
    taskIds: string[];
    createdAt: Date;
}
export declare enum AttachmentTyp {
    screenshot = "screenshot",
    diagramm = "diagramm",
    code = "code",
    sonstiges = "sonstiges"
}
export declare enum KommentarArt {
    allgemein = "allgemein",
    fachlich = "fachlich",
    formal = "formal",
    aufgabenkopplung = "aufgabenkopplung"
}
export declare class AddAttachmentDto {
    typ: AttachmentTyp;
    dateiUrl: string;
    kommentar?: string;
}
export declare class AddTimeEntryDto {
    taskId?: string;
    stunden: number;
    kommentar?: string;
}
export declare class BatchReviewDto {
    reportIds: string[];
    entscheidung: 'freigeben' | 'zurueck';
    kommentar?: string;
}
export declare class VersionResponseDto {
    id: string;
    reportId: string;
    version: number;
    inhaltMarkdown: string;
    erstelltVon: string | null;
    createdAt: Date;
}
export declare class DiffResponseDto {
    v1: string;
    v2: string;
}
