export declare class AzubiAkteResponseDto {
    id: string;
    name: string;
    email: string;
    beruf?: string;
    vertragsStart?: Date;
    vertragsEnde?: Date;
    planStatus?: string;
    nachweiseCount?: number;
    einsaetzeCount?: number;
    abwesenheitenCount?: number;
}
export declare class AzubiAkteOverviewDto {
    totalAzubis: number;
    aktiveVertraege: number;
    gesamtNachweise: number;
    inPruefung: number;
}
