import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AbwesenheitService } from './absence.service.js';
import { AbwesenheitResponseDto, CreateAbwesenheitDto, UpdateAbwesenheitDto } from './dto/absence.dto.js';
export declare class AbwesenheitController {
    private readonly service;
    constructor(service: AbwesenheitService);
    create(user: CurrentUser, dto: CreateAbwesenheitDto): Promise<AbwesenheitResponseDto>;
    findAll(user: CurrentUser): Promise<AbwesenheitResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<AbwesenheitResponseDto>;
    update(id: string, user: CurrentUser, dto: UpdateAbwesenheitDto): Promise<AbwesenheitResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
