import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateAusbildungsplanDto, UpdateAusbildungsplanDto, AusbildungsplanResponseDto } from './dto/ausbildungsplan.dto.js';
export declare class AusbildungsplanService {
    private readonly prisma;
    private readonly scope;
    private readonly auditService;
    constructor(prisma: PrismaService, scope: AccessScopeService, auditService: AuditService);
    create(user: CurrentUser, dto: CreateAusbildungsplanDto): Promise<AusbildungsplanResponseDto>;
    findAll(user: CurrentUser): Promise<AusbildungsplanResponseDto[]>;
    findOne(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto>;
    update(user: CurrentUser, id: string, dto: UpdateAusbildungsplanDto): Promise<AusbildungsplanResponseDto>;
    remove(user: CurrentUser, id: string): Promise<void>;
    submit(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto>;
    review(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto>;
    approve(user: CurrentUser, id: string): Promise<AusbildungsplanResponseDto>;
    getRahmenlehrplan(user: CurrentUser, id: string): Promise<Record<string, any>>;
    private assertScopedAccess;
    private toResponse;
}
