import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart } from '@prisma/client';
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
export declare class UpdateGradeEntryDto {
    fach?: string;
    halbjahr?: string;
    note?: number;
    datum?: Date;
    pruefungsart?: string;
    gewichtung?: number;
    zeugnisUrl?: string;
}
export declare class UpdateGradeEntryResponseDto {
    id: string;
    azubiId: string;
    fach: string;
    halbjahr: string | null;
    note: number;
    datum: Date | null;
    pruefungsart: string | null;
    gewichtung: number;
    zeugnisUrl: string | null;
    createdAt: Date;
}
