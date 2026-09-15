import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { ProjektResponseDto, CreateProjektDto, UpdateProjektDto } from './dto/projekt.dto.js';
export declare class ProjektService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreateProjektDto): Promise<ProjektResponseDto>;
    findAll(currentUser: CurrentUser): Promise<ProjektResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<ProjektResponseDto>;
    update(id: string, currentUser: CurrentUser, dto: UpdateProjektDto): Promise<ProjektResponseDto>;
    submit(id: string, currentUser: CurrentUser): Promise<ProjektResponseDto>;
    review(id: string, currentUser: CurrentUser, dto: {
        bewertung: string;
        status: 'freigegeben' | 'abgelehnt';
    }): Promise<ProjektResponseDto>;
    requestRevision(id: string, currentUser: CurrentUser): Promise<ProjektResponseDto>;
    archive(id: string, currentUser: CurrentUser): Promise<void>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private scopeWhere;
    private canManage;
    private canReview;
    private toResponse;
}
