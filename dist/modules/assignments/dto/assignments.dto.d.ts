export declare class CreateEinsatzDto {
    azubiId: string;
    abteilungId: string;
    von: string;
    bis: string;
    skillLevel?: number;
}
export declare class UpdateEinsatzDto {
    abteilungId?: string;
    von?: string;
    bis?: string;
    skillLevel?: number;
}
export declare class EinsatzResponseDto {
    id: string;
    azubiId: string;
    abteilungId: string;
    von: Date;
    bis: Date;
    skillLevel: number;
}
