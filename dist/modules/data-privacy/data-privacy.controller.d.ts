import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { DatenschutzService } from './data-privacy.service.js';
import { ConsentGrantDto, ConsentLogResponseDto, ConsentResponseDto, ConsentRevokeDto, CreateDatenschutzRequestDto, DatenschutzRequestResponseDto, DpiaDto, DpiaResponseDto, LegalBasisDto, LegalBasisResponseDto, ProcessDatenschutzRequestDto, UpdateDpiaDto, UpdateLegalBasisDto } from './dto/data-privacy.dto.js';
export declare class DatenschutzController {
    private readonly service;
    constructor(service: DatenschutzService);
    createRequest(user: CurrentUser, dto: CreateDatenschutzRequestDto): Promise<DatenschutzRequestResponseDto>;
    findAllRequests(user: CurrentUser): Promise<DatenschutzRequestResponseDto[]>;
    findRequest(id: string, user: CurrentUser): Promise<DatenschutzRequestResponseDto>;
    processRequest(id: string, user: CurrentUser, dto: ProcessDatenschutzRequestDto): Promise<DatenschutzRequestResponseDto>;
    exportPersonalData(id: string, user: CurrentUser, res: Response): Promise<void>;
    anonymize(azubiId: string, user: CurrentUser): Promise<{
        ok: boolean;
        anonymizedUserId: string;
    }>;
    findConsents(user: CurrentUser): Promise<ConsentResponseDto[]>;
    grantConsent(user: CurrentUser, dto: ConsentGrantDto, ip?: string): Promise<ConsentResponseDto>;
    revokeConsent(key: string, user: CurrentUser, dto: ConsentRevokeDto, ip?: string): Promise<ConsentResponseDto>;
    findConsentLog(user: CurrentUser): Promise<ConsentLogResponseDto[]>;
    findAllLegalBases(): Promise<LegalBasisResponseDto[]>;
    createLegalBasis(dto: LegalBasisDto): Promise<LegalBasisResponseDto>;
    updateLegalBasis(id: string, dto: UpdateLegalBasisDto): Promise<LegalBasisResponseDto>;
    removeLegalBasis(id: string): Promise<void>;
    findAllDpia(): Promise<DpiaResponseDto[]>;
    createDpia(user: CurrentUser, dto: DpiaDto): Promise<DpiaResponseDto>;
    updateDpia(id: string, user: CurrentUser, dto: UpdateDpiaDto): Promise<DpiaResponseDto>;
    removeDpia(id: string): Promise<void>;
}
