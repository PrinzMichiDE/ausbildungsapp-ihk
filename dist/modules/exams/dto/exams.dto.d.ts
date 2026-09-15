export declare class CreatePruefungDto {
    beschreibung?: string;
    ihkTermin?: string;
}
declare const UpdatePruefungDto_base: import("@nestjs/common").Type<Partial<CreatePruefungDto>>;
export declare class UpdatePruefungDto extends UpdatePruefungDto_base {
}
export declare class PruefungResponseDto {
    id: string;
    azubiId: string;
    typ: string;
    status: string;
    beschreibung: string | null;
    ihkTermin: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class CreateMeilensteinDto {
    titel: string;
    beschreibung?: string;
    faelligAm?: string;
}
declare const UpdateMeilensteinDto_base: import("@nestjs/common").Type<Partial<CreateMeilensteinDto>>;
export declare class UpdateMeilensteinDto extends UpdateMeilensteinDto_base {
}
export declare class PruefungsMeilensteinResponseDto {
    id: string;
    pruefungId: string;
    titel: string;
    beschreibung: string | null;
    faelligAm: Date | null;
    erledigt: boolean;
    erledigtAm: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
export {};
