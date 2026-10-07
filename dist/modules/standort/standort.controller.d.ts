import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { StandortService } from './standort.service.js';
import { CreateStandortDto, UpdateStandortDto } from './dto/standort.dto.js';
export declare class StandortController {
    private readonly service;
    constructor(service: StandortService);
    findAll(user: CurrentUser): Promise<import("./dto/standort.dto.js").StandortResponseDto[]>;
    create(user: CurrentUser, dto: CreateStandortDto): Promise<import("./dto/standort.dto.js").StandortResponseDto>;
    findOne(user: CurrentUser, id: string): Promise<import("./dto/standort.dto.js").StandortResponseDto>;
    update(user: CurrentUser, id: string, dto: UpdateStandortDto): Promise<import("./dto/standort.dto.js").StandortResponseDto>;
    remove(user: CurrentUser, id: string): Promise<void>;
}
