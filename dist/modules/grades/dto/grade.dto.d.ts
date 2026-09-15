import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart } from '@prisma/client';
export declare class CreateGradeDto {
    azubiId?: string;
    fach: string;
    note: number;
    zeitraum: string;
    halbjahr?: Halbjahr;
    datum?: Date;
    pruefungsart?: Pruefungsart;
    gewichtung?: number;
    gewichtungsKategorie?: Gewichtungskategorie;
    typ?: GradeTyp;
    beschreibung?: string;
    bemerkungen?: string;
    prueferId?: string;
    pruefungsdatum?: Date;
    wiederholung?: boolean;
    maßnahme?: string;
    zeugnisUrl?: string;
    quellenUrl?: string;
    kursId?: string;
}
export declare class UpdateGradeDto {
    fach?: string;
    note?: number;
    zeitraum?: string;
    halbjahr?: Halbjahr;
    datum?: Date;
    pruefungsart?: Pruefungsart;
    gewichtung?: number;
    gewichtungsKategorie?: Gewichtungskategorie;
    typ?: GradeTyp;
    beschreibung?: string;
    bemerkungen?: string;
    prueferId?: string;
    pruefungsdatum?: Date;
    wiederholung?: boolean;
    maßnahme?: string;
    zeugnisUrl?: string;
    quellenUrl?: string;
    kursId?: string;
    status?: GradeStatus;
}
export declare class GradeResponseDto {
    id: string;
    azubiId: string;
    fach: string;
    note: number;
    zeitraum: string;
    halbjahr: Halbjahr | null;
    datum: Date | null;
    pruefungsart: Pruefungsart | null;
    gewichtung: number;
    gewichtungsKategorie: Gewichtungskategorie | null;
    typ: GradeTyp;
    status: GradeStatus;
    beschreibung: string | null;
    bemerkungen: string | null;
    prueferId: string | null;
    pruefungsdatum: Date | null;
    wiederholung: boolean;
    maßnahme: string | null;
    zeugnisUrl: string | null;
    quellenUrl: string | null;
    kursId: string | null;
    bewertetVon: string | null;
    bewertetAm: Date | null;
    bewertung: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class GradeVersionResponseDto {
    id: string;
    gradeId: string;
    version: number;
    fach: string;
    note: number;
    status: GradeStatus;
    zeitraum: string;
    halbjahr: Halbjahr | null;
    datum: Date | null;
    pruefungsart: Pruefungsart | null;
    gewichtung: number;
    gewichtungsKategorie: Gewichtungskategorie | null;
    typ: GradeTyp;
    bemerkungen: string | null;
    prueferId: string | null;
    pruefungsdatum: Date | null;
    wiederholung: boolean;
    maßnahme: string | null;
    zeugnisUrl: string | null;
    bewertetVon: string | null;
    bewertetAm: Date | null;
    erstelltVon: string | null;
    createdAt: Date;
}
export declare class GradeStatusDto {
    status: GradeStatus;
}
export declare class GradeTypDto {
    typ: GradeTyp;
}
export declare class HalbjahrDto {
    halbjahr: Halbjahr;
}
export declare class GewichtungskategorieDto {
    gewichtungsKategorie: Gewichtungskategorie;
}
export declare class PruefungsartDto {
    pruefungsart: Pruefungsart;
}
