import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateEinsatzDto, EinsatzResponseDto, UpdateEinsatzDto } from './dto/assignments.dto.js';
export declare class EinsatzService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(dto: CreateEinsatzDto): Promise<EinsatzResponseDto>;
    findAll(currentUser: CurrentUser): Promise<EinsatzResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<EinsatzResponseDto>;
    update(id: string, dto: UpdateEinsatzDto, currentUser: CurrentUser): Promise<EinsatzResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    getPlan(currentUser: CurrentUser): Promise<({
        abteilung: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            kurzzeichen: string | null;
            beschreibung: string | null;
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
    private buildScopeWhere;
    private assertAusbilder;
    private toResponse;
}
