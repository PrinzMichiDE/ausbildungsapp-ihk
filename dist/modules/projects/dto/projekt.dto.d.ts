export declare class CreateProjektDto {
    titel: string;
    beschreibung?: string;
    projektantrag?: string;
    projektdoku?: string;
}
declare const UpdateProjektDto_base: import("@nestjs/common").Type<Partial<CreateProjektDto>>;
export declare class UpdateProjektDto extends UpdateProjektDto_base {
}
export declare class ProjektResponseDto {
    id: string;
    azubiId: string;
    titel: string;
    beschreibung: string | null;
    projektantrag: string | null;
    projektdoku: string | null;
    status: string;
    bewertung: string | null;
    bewertetVon: string | null;
    bewertetAm: Date | null;
    freigegeben: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export {};
