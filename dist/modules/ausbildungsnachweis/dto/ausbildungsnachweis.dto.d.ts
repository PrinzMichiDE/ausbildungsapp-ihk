import { AusbildungsnachweisStatus } from '../../../common/enums/ausbildungsmanagement.enums';
export declare class CreateAusbildungsnachweisDto {
    azubiId: string;
    titel: string;
    inhaltMarkdown: string;
    rahmenlehrplanId: string;
    typ: string;
}
export declare class AusbildungsnachweisResponseDto {
    id: string;
    azubiId: string;
    titel: string;
    inhaltMarkdown: string;
    rahmenlehrplanId: string;
    typ: string;
    status: AusbildungsnachweisStatus;
    signiertVon: string | null;
    signiertAm: Date | null;
    archiviertAm: Date | null;
    erstelltAm: Date;
    updatedAt: Date;
}
declare const UpdateAusbildungsnachweisDto_base: import("@nestjs/common").Type<Partial<CreateAusbildungsnachweisDto>>;
export declare class UpdateAusbildungsnachweisDto extends UpdateAusbildungsnachweisDto_base {
}
export {};
