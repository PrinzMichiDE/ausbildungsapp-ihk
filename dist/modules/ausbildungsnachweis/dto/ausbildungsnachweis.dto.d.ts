export declare class CreateAusbildungsnachweisDto {
    titel: string;
    inhaltMarkdown: string;
    beruf?: string;
    rahmenlehrplanId?: string;
    anhaenge?: string[];
}
export declare class AusbildungsnachweisResponseDto {
    id: string;
    azubiId: string;
    beruf?: string;
    titel: string;
    inhaltMarkdown: string;
    status: string;
    signiertVon?: string | null;
    signiertAm?: Date | null;
    archiviertAm?: Date | null;
    rahmenlehrplanId?: string | null;
    erstelltAm: Date;
    updatedAt: Date;
}
declare const UpdateAusbildungsnachweisDto_base: import("@nestjs/common").Type<Partial<CreateAusbildungsnachweisDto>>;
export declare class UpdateAusbildungsnachweisDto extends UpdateAusbildungsnachweisDto_base {
}
export declare class AddCommentDto {
    text: string;
    art?: string;
}
export declare class AddVersionDto {
    inhaltMarkdown: string;
    status?: string;
}
export {};
