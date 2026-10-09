export declare enum EinsatzStatus {
    GEPLANT = "geplant",
    BESTATIGT = "bestatigt",
    ABGESCHLOSSEN = "abgeschlossen",
    STORNIERT = "storniert"
}
export declare class CreateEinsatzPlanungDto {
    azubiId: string;
    abteilungId: string;
    von: Date;
    bis: Date;
    beschreibung?: string;
    status?: EinsatzStatus;
    kommentar?: string;
}
export declare class UpdateEinsatzPlanungDto {
    azubiId?: string;
    abteilungId?: string;
    von?: Date;
    bis?: Date;
    beschreibung?: string;
    status?: EinsatzStatus;
    kommentar?: string;
}
export declare class EinsatzPlanungQueryDto {
    azubiId?: string;
    abteilungId?: string;
    status?: EinsatzStatus;
    von?: Date;
    bis?: Date;
    page?: number;
    limit?: number;
}
export declare class EinsatzPlanungResponseDto {
    id: string;
    azubiId: string;
    abteilungId: string;
    von: Date;
    bis: Date;
    beschreibung?: string;
    status: EinsatzStatus;
    kommentar?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class EinsatzUserAssignmentDto {
    azubiId: string;
}
