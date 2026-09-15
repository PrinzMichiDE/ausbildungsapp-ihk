import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ProjektService } from './projects.service.js';
import { ProjektResponseDto, CreateProjektDto, UpdateProjektDto } from './dto/projekt.dto.js';
export declare class ProjektController {
    private readonly service;
    constructor(service: ProjektService);
    create(user: CurrentUser, dto: CreateProjektDto): Promise<ProjektResponseDto>;
    findAll(user: CurrentUser): Promise<ProjektResponseDto[]>;
    findOne(id: string, user: CurrentUser): Promise<ProjektResponseDto>;
    update(id: string, dto: UpdateProjektDto, user: CurrentUser): Promise<ProjektResponseDto>;
    submit(id: string, user: CurrentUser): Promise<ProjektResponseDto>;
    review(id: string, user: CurrentUser, dto: {
        bewertung: string;
        status: 'freigegeben' | 'abgelehnt';
    }): Promise<ProjektResponseDto>;
    requestRevision(id: string, user: CurrentUser): Promise<ProjektResponseDto>;
    archive(id: string, user: CurrentUser): Promise<void>;
    remove(id: string, user: CurrentUser): Promise<void>;
}
