import { ConsentAction, DatenschutzRequestStatus, DatenschutzRequestTyp, DpiaRisk, DpiaStatus, LegalBasisArticle } from '@prisma/client';
export declare class CreateDatenschutzRequestDto {
    typ: DatenschutzRequestTyp;
    azubiId?: string;
    details?: string;
}
export declare class ProcessDatenschutzRequestDto {
    status: DatenschutzRequestStatus;
    result?: string;
}
export declare class DatenschutzRequestResponseDto {
    id: string;
    userId: string;
    typ: DatenschutzRequestTyp;
    status: DatenschutzRequestStatus;
    details: string | null;
    requestedAt: Date;
    dueDate: Date | null;
    completedAt: Date | null;
    result: string | null;
    processedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ConsentGrantDto {
    key: string;
    version?: string;
    text?: string;
    source?: string;
}
export declare class ConsentRevokeDto {
    version?: string;
}
export declare class ConsentResponseDto {
    id: string;
    userId: string;
    key: string;
    version: string;
    text: string | null;
    grantedAt: Date;
    revokedAt: Date | null;
    ipAddress: string | null;
    source: string | null;
    active: boolean;
}
export declare class ConsentLogResponseDto {
    id: string;
    userId: string;
    key: string;
    version: string;
    action: ConsentAction;
    text: string | null;
    ipAddress: string | null;
    source: string | null;
    createdAt: Date;
}
export declare class LegalBasisDto {
    title: string;
    purpose: string;
    dataCategories: string[];
    recipients: string[];
    retentionPeriod?: string;
    legalBasis: LegalBasisArticle;
    controller?: string;
    active?: boolean;
}
declare const UpdateLegalBasisDto_base: import("@nestjs/common").Type<Partial<LegalBasisDto>>;
export declare class UpdateLegalBasisDto extends UpdateLegalBasisDto_base {
}
export declare class LegalBasisResponseDto {
    id: string;
    title: string;
    purpose: string;
    dataCategories: string[];
    recipients: string[];
    retentionPeriod: string | null;
    legalBasis: LegalBasisArticle;
    controller: string | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class DpiaDto {
    title: string;
    description?: string;
    riskLevel: DpiaRisk;
    measures?: string;
    status: DpiaStatus;
    assessedAt?: string;
}
declare const UpdateDpiaDto_base: import("@nestjs/common").Type<Partial<DpiaDto>>;
export declare class UpdateDpiaDto extends UpdateDpiaDto_base {
}
export declare class DpiaResponseDto {
    id: string;
    title: string;
    description: string | null;
    riskLevel: DpiaRisk;
    measures: string | null;
    status: DpiaStatus;
    assessedAt: Date | null;
    assessedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface PersonalDataExport {
    exportedAt: string;
    user: Record<string, unknown>;
    profile: Record<string, unknown>;
    einsaetze: unknown[];
    berichte: unknown[];
    zertifikate: unknown[];
    abwesenheiten: unknown[];
    noten: unknown[];
    checklisten: unknown[];
    feedbackGegeben: unknown[];
    feedbackErhalten: unknown[];
    pruefungen: unknown[];
    projekte: unknown[];
    konsente: unknown[];
}
export {};
