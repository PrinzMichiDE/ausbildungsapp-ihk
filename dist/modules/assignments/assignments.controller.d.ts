import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { EinsatzService } from './assignments.service.js';
import { CreateEinsatzDto, EinsatzResponseDto, UpdateEinsatzDto } from './dto/assignments.dto.js';
export declare class EinsatzController {
    private readonly service;
    constructor(service: EinsatzService);
    create(dto: CreateEinsatzDto): Promise<EinsatzResponseDto>;
    findAll(user: CurrentUser): Promise<EinsatzResponseDto[]>;
    getPlan(user: CurrentUser): Promise<({
        abteilung: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            kurzzeichen: string | null;
            beschreibung: string | null;
            standortId: string | null;
        };
        azubi: {
            id: string;
            azubiId: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            isActive: boolean;
            mfaActive: boolean;
            passwordHash: string;
            mfaSecret: string | null;
        };
    } & {
        id: string;
        azubiId: string;
        abteilungId: string;
        von: Date;
        bis: Date;
        skillLevel: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string, user: CurrentUser): Promise<EinsatzResponseDto>;
    update(id: string, dto: UpdateEinsatzDto, user: CurrentUser): Promise<EinsatzResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
