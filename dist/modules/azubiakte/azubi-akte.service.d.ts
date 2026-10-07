import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AzubiAkteResponseDto, AzubiAkteOverviewDto } from './dto/azubi-akte.dto.js';
export declare class AzubiAkteService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    findAll(user: CurrentUser): Promise<AzubiAkteResponseDto[]>;
    findOne(user: CurrentUser, azubiId: string): Promise<AzubiAkteResponseDto>;
    overview(user: CurrentUser): Promise<AzubiAkteOverviewDto>;
    private toResponse;
}
