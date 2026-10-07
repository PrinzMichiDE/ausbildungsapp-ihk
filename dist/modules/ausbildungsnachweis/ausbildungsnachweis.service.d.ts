import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AuditService } from '../audit/audit.service.js';
import { CreateAusbildungsnachweisDto, UpdateAusbildungsnachweisDto, AusbildungsnachweisResponseDto, AddCommentDto, AddVersionDto } from './dto/ausbildungsnachweis.dto.js';
export declare class AusbildungsnachweisService {
    private readonly prisma;
    private readonly scope;
    private readonly auditService;
    constructor(prisma: PrismaService, scope: AccessScopeService, auditService: AuditService);
    create(user: CurrentUser, dto: CreateAusbildungsnachweisDto): Promise<AusbildungsnachweisResponseDto>;
    findAll(user: CurrentUser): Promise<AusbildungsnachweisResponseDto[]>;
    findOne(user: CurrentUser, id: string): Promise<AusbildungsnachweisResponseDto>;
    update(user: CurrentUser, id: string, dto: UpdateAusbildungsnachweisDto): Promise<AusbildungsnachweisResponseDto>;
    submit(user: CurrentUser, id: string): Promise<AusbildungsnachweisResponseDto>;
    review(user: CurrentUser, id: string): Promise<AusbildungsnachweisResponseDto>;
    approve(user: CurrentUser, id: string): Promise<AusbildungsnachweisResponseDto>;
    archive(user: CurrentUser, id: string): Promise<AusbildungsnachweisResponseDto>;
    addComment(user: CurrentUser, id: string, dto: AddCommentDto): Promise<{
        success: boolean;
    }>;
    addVersion(user: CurrentUser, id: string, dto: AddVersionDto): Promise<{
        success: boolean;
    }>;
    private assertScopedAccess;
    private toResponse;
}
