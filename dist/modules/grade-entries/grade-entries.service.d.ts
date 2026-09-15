import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateGradeEntryDto, GradeEntryResponseDto } from './dto/grade-entry.dto.js';
export declare class GradeentryService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreateGradeEntryDto): Promise<GradeEntryResponseDto>;
    findAll(currentUser: CurrentUser): Promise<GradeEntryResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<GradeEntryResponseDto>;
    update(id: string, currentUser: CurrentUser, dto: {
        fach?: string;
        halbjahr?: string;
        note?: number;
        datum?: Date;
        pruefungsart?: string;
        gewichtung?: number;
        zeugnisUrl?: string;
    }): Promise<GradeEntryResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private scopeWhere;
    private toResponse;
}
