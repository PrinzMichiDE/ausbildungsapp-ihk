import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { GradeentryService } from './grade-entries.service.js';
import { CreateGradeEntryDto, GradeEntryResponseDto } from './dto/grade-entry.dto.js';
export declare class GradeentryController {
    private readonly service;
    constructor(service: GradeentryService);
    create(user: CurrentUser, dto: CreateGradeEntryDto): Promise<GradeEntryResponseDto>;
    findAll(user: CurrentUser): Promise<GradeEntryResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<GradeEntryResponseDto>;
    update(id: string, user: CurrentUser, dto: Partial<CreateGradeEntryDto>): Promise<GradeEntryResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
