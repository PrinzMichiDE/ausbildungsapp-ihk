export declare class CreateGradeEntryDto {
    azubiId?: string;
    fach: string;
    halbjahr?: string;
    note: number;
    datum?: Date;
    pruefungsart?: string;
    gewichtung?: number;
    zeugnisUrl?: string;
}
export declare class GradeEntryResponseDto {
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
