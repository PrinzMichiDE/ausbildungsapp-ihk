export declare class CreateBadgeDto {
    schluessel: string;
    titel: string;
    beschreibung?: string;
    icon?: string;
}
export declare class BadgeResponseDto {
    id: string;
    schluessel: string;
    titel: string;
    beschreibung: string | null;
    icon: string | null;
}
export declare class UserBadgeResponseDto {
    id: string;
    azubiId: string;
    earnedAt: Date;
    badge: BadgeResponseDto;
}
