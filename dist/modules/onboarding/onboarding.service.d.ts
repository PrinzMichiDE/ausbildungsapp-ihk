import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { ChecklistResponseDto, CreateChecklistDto, UpdateChecklistItemDto } from './dto/checklist.dto.js';
export declare class OnboardingService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreateChecklistDto): Promise<ChecklistResponseDto>;
    findAll(currentUser: CurrentUser): Promise<ChecklistResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<ChecklistResponseDto>;
    updateItem(id: string, itemId: string, currentUser: CurrentUser, dto: UpdateChecklistItemDto): Promise<ChecklistResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private scopeWhere;
    private canManage;
    private toResponse;
}
