export declare class CreateChecklistDto {
    azubiId?: string;
    titel: string;
    items: string[];
}
export declare class UpdateChecklistItemDto {
    erledigt: boolean;
}
export declare class ChecklistResponseDto {
    id: string;
    azubiId: string;
    titel: string;
    erledigt: boolean;
    items: Array<{
        id: string;
        text: string;
        erledigt: boolean;
        reihenfolge: number;
    }>;
}
