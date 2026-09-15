export declare enum FeedbackGespraechTyp {
    regelmaessig = "regelmaessig",
    anlassbezogen = "anlassbezogen",
    probezeit = "probezeit",
    uebernahme = "uebernahme"
}
export declare enum FeedbackGespraechStatus {
    geplant = "geplant",
    durchgefuehrt = "durchgefuehrt",
    dokumentiert = "dokumentiert",
    nachverfolgt = "nachverfolgt"
}
export declare class CreateFeedbackGespraechDto {
    azubiId: string;
    typ: FeedbackGespraechTyp;
    termin?: string;
    ziele?: string;
    sichtbarkeitAzubi?: boolean;
}
export declare class UpdateFeedbackGespraechDto {
    status?: FeedbackGespraechStatus;
    verlaufsnotiz?: string;
    ziele?: string;
    durchgefuehrtAm?: string;
    sichtbarkeitAzubi?: boolean;
}
export declare class CreateVereinbarungDto {
    text: string;
    faelligAm?: string;
}
