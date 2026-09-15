import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { PruefungService } from './exams.service.js';
import { PruefungResponseDto, CreatePruefungDto, UpdatePruefungDto, PruefungsMeilensteinResponseDto, CreateMeilensteinDto, UpdateMeilensteinDto } from './dto/exams.dto.js';
export declare class PruefungController {
    private readonly service;
    constructor(service: PruefungService);
    create(user: CurrentUser, dto: CreatePruefungDto): Promise<PruefungResponseDto>;
    findAll(user: CurrentUser): Promise<PruefungResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<PruefungResponseDto>;
    update(id: string, dto: UpdatePruefungDto, user: CurrentUser): Promise<PruefungResponseDto>;
    statusChange(id: string, status: string, user: CurrentUser): Promise<PruefungResponseDto>;
    addMeilenstein(id: string, user: CurrentUser, dto: CreateMeilensteinDto): Promise<PruefungsMeilensteinResponseDto>;
    updateMeilenstein(id: string, meilensteinId: string, user: CurrentUser, dto: UpdateMeilensteinDto): Promise<PruefungsMeilensteinResponseDto>;
    completeMeilenstein(id: string, meilensteinId: string, user: CurrentUser): Promise<PruefungsMeilensteinResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
