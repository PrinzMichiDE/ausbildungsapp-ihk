export declare enum AlertTyp {
    noten = "noten",
    berichtsheft = "berichtsheft",
    kurs = "kurs",
    pruefung = "pruefung",
    foerderbedarf = "foerderbedarf",
    kapazitaet = "kapazitaet"
}
export declare class CreateAlertConfigDto {
    typ: AlertTyp;
    schwelle: Record<string, unknown>;
    aktiv?: boolean;
}
export declare class UpdateAlertConfigDto {
    typ?: AlertTyp;
    schwelle?: Record<string, unknown>;
    aktiv?: boolean;
}
export declare class AlertConfigResponseDto {
    id: string;
    userId: string | null;
    typ: string;
    schwelle: Record<string, unknown>;
    aktiv: boolean;
    createdAt: Date;
    updatedAt: Date;
}
