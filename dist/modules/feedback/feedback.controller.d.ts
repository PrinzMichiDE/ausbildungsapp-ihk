import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FeedbackService } from './feedback.service.js';
import { CreateFeedbackDto, FeedbackResponseDto } from './dto/feedback.dto.js';
export declare class FeedbackController {
    private readonly service;
    constructor(service: FeedbackService);
    create(user: CurrentUser, dto: CreateFeedbackDto): Promise<FeedbackResponseDto>;
    findAll(user: CurrentUser): Promise<FeedbackResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<FeedbackResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
