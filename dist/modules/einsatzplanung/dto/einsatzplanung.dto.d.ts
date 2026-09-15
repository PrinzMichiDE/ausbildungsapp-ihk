export declare class CreateEinsatzPlanungDto {
    beruf: string;
    abteilungId: string;
    von: Date;
    bis: Date;
    skillLevel?: number;
}
export declare class EinsatzPlanungResponseDto {
    id: string;
    beruf: string;
    abteilungId: string;
    von: Date;
    bis: Date;
    skillLevel: number | null;
}
