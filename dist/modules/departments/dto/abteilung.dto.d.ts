export declare class CreateAbteilungDto {
    name: string;
    kurzzeichen?: string;
    beschreibung?: string;
}
export declare class UpdateAbteilungDto {
    name?: string;
    kurzzeichen?: string;
    beschreibung?: string;
}
export declare class AbteilungResponseDto {
    id: string;
    name: string;
    kurzzeichen: string | null;
    beschreibung: string | null;
}
