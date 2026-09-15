export declare class CreateKompetenzprofilDto {
    fachkompetenzen: string[];
    sozialkompetenzen: string[];
    staerken?: string[];
    schwaechen?: string[];
}
export declare class KompetenzprofilResponseDto {
    id: string;
    fachkompetenzen: string[];
    sozialkompetenzen: string[];
    staerken: string[] | null;
    schwaechen: string[] | null;
}
declare const UpdateKompetenzprofilDto_base: import("@nestjs/common").Type<Partial<CreateKompetenzprofilDto>>;
export declare class UpdateKompetenzprofilDto extends UpdateKompetenzprofilDto_base {
}
export declare class BewerteKompetenzDto {
    bewertung: number;
    kommentar?: string;
}
export {};
