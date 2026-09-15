import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { GamificationService } from './gamification.service.js';
import { BadgeResponseDto, CreateBadgeDto, UserBadgeResponseDto } from './dto/badge.dto.js';
export declare class GamificationController {
    private readonly service;
    constructor(service: GamificationService);
    createBadge(dto: CreateBadgeDto): Promise<BadgeResponseDto>;
    listBadges(): Promise<BadgeResponseDto[]>;
    listUserBadges(azubiId: string, user: CurrentUser): Promise<UserBadgeResponseDto[]>;
    award(azubiId: string, schluessel: string, user: CurrentUser): Promise<UserBadgeResponseDto>;
}
