import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateFeedbackDto, FeedbackResponseDto } from './dto/feedback.dto.js';
export declare class FeedbackService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(currentUser: CurrentUser, dto: CreateFeedbackDto): Promise<FeedbackResponseDto>;
    findAll(currentUser: CurrentUser): Promise<FeedbackResponseDto[]>;
    findOne(id: string, currentUser: CurrentUser): Promise<FeedbackResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    private assertVisible;
    private scopeWhere;
    private isPrivileged;
    private toResponse;
}
