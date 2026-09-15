import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { BadgeResponseDto, CreateBadgeDto, UserBadgeResponseDto } from './dto/badge.dto.js';
export declare class GamificationService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    createBadge(dto: CreateBadgeDto): Promise<BadgeResponseDto>;
    listBadges(): Promise<BadgeResponseDto[]>;
    listUserBadges(currentUser: CurrentUser, azubiId?: string): Promise<UserBadgeResponseDto[]>;
    awardBadge(currentUser: CurrentUser, azubiId: string, schluessel: string): Promise<UserBadgeResponseDto>;
    private resolveTarget;
    private canAward;
    private toBadge;
    private toUserBadge;
}
