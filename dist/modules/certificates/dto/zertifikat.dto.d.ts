export declare class CreateZertifikatDto {
    azubiId?: string;
    titel: string;
    aussteller: string;
    erworbenAm: string;
    dokumentUrl?: string;
}
export declare class UpdateZertifikatDto {
    titel?: string;
    aussteller?: string;
    erworbenAm?: string;
    dokumentUrl?: string;
}
export declare class ZertifikatResponseDto {
    id: string;
    azubiId: string;
    titel: string;
    aussteller: string;
    erworbenAm: Date;
    dokumentUrl: string | null;
}
