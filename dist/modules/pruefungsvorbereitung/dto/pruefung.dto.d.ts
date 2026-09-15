export declare class CreatePruefungssimulationDto {
    beruf: string;
    typ: string;
    aufgaben: string[];
    loesungen?: string[];
    bewertung?: number;
}
export declare class PruefungssimulationResponseDto {
    id: string;
    beruf: string;
    typ: string;
    aufgaben: string[];
    loesungen: string[] | null;
    bewertung: number | null;
}
