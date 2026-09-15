export declare class CreateStandortDto {
    name: string;
    adresse?: string;
    plz?: string;
    ort?: string;
}
export declare class StandortResponseDto {
    id: string;
    name: string;
    adresse: string | null;
    plz: string | null;
    ort: string | null;
}
declare const UpdateStandortDto_base: import("@nestjs/common").Type<Partial<CreateStandortDto>>;
export declare class UpdateStandortDto extends UpdateStandortDto_base {
}
export {};
