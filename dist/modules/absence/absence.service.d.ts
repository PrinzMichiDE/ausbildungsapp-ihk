import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AbwesenheitResponseDto, CreateAbwesenheitDto, UpdateAbwesenheitDto } from './dto/absence.dto.js';
export declare class AbwesenheitService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreateAbwesenheitDto): Promise<AbwesenheitResponseDto>;
    findAll(currentUser: CurrentUser): Promise<AbwesenheitResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<AbwesenheitResponseDto>;
    update(id: string, currentUser: CurrentUser, dto: UpdateAbwesenheitDto): Promise<AbwesenheitResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private resolveAzubiId;
    private scopeWhere;
    private canManage;
    private toResponse;
}
