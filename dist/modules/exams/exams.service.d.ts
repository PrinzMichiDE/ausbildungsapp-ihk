import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { PruefungResponseDto, CreatePruefungDto, UpdatePruefungDto, PruefungsMeilensteinResponseDto, CreateMeilensteinDto, UpdateMeilensteinDto } from './dto/exams.dto.js';
export declare class PruefungService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreatePruefungDto): Promise<PruefungResponseDto>;
    findAll(currentUser: CurrentUser): Promise<PruefungResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<PruefungResponseDto>;
    update(id: string, currentUser: CurrentUser, dto: UpdatePruefungDto): Promise<PruefungResponseDto>;
    addMeilenstein(pruefungId: string, currentUser: CurrentUser, dto: CreateMeilensteinDto): Promise<PruefungsMeilensteinResponseDto>;
    updateMeilenstein(pruefungId: string, meilensteinId: string, currentUser: CurrentUser, dto: UpdateMeilensteinDto): Promise<PruefungsMeilensteinResponseDto>;
    completeMeilenstein(pruefungId: string, meilensteinId: string, currentUser: CurrentUser): Promise<PruefungsMeilensteinResponseDto>;
    statusChange(id: string, currentUser: CurrentUser, status: string): Promise<PruefungResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private scopeWhere;
    private canManage;
    private toResponse;
    private toMeilensteinResponse;
}
