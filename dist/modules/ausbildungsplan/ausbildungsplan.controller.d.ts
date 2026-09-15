import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AusbildungsplanService } from './ausbildungsplan.service.js';
import { CreateAusbildungsplanDto, UpdateAusbildungsplanDto } from './dto/ausbildungsplan.dto.js';
export declare class AusbildungsplanController {
    private readonly service;
    constructor(service: AusbildungsplanService);
    findAll(user: CurrentUser): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto[]>;
    create(user: CurrentUser, dto: CreateAusbildungsplanDto): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto>;
    findOne(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto>;
    update(user: CurrentUser, id: string, dto: UpdateAusbildungsplanDto): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto>;
    remove(user: CurrentUser, id: string): Promise<void>;
    submit(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto>;
    review(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto>;
    approve(user: CurrentUser, id: string): Promise<import("./dto/ausbildungsplan.dto.js").AusbildungsplanResponseDto>;
    getRahmenlehrplan(user: CurrentUser, id: string): Promise<Record<string, any>>;
}
