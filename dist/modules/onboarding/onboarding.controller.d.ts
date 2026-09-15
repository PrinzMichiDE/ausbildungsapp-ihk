import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { OnboardingService } from './onboarding.service.js';
import { ChecklistResponseDto, CreateChecklistDto, UpdateChecklistItemDto } from './dto/checklist.dto.js';
export declare class OnboardingController {
    private readonly service;
    constructor(service: OnboardingService);
    create(user: CurrentUser, dto: CreateChecklistDto): Promise<ChecklistResponseDto>;
    findAll(user: CurrentUser): Promise<ChecklistResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<ChecklistResponseDto>;
    updateItem(id: string, itemId: string, user: CurrentUser, dto: UpdateChecklistItemDto): Promise<ChecklistResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
