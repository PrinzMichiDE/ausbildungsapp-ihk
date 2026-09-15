import { AbteilungenService } from './departments.service.js';
import { AbteilungResponseDto, CreateAbteilungDto, UpdateAbteilungDto } from './dto/abteilung.dto.js';
export declare class AbteilungenController {
    private readonly service;
    constructor(service: AbteilungenService);
    create(dto: CreateAbteilungDto): Promise<AbteilungResponseDto>;
    findAll(): Promise<AbteilungResponseDto[]>;
    findOne(id: string): Promise<AbteilungResponseDto>;
    update(id: string, dto: UpdateAbteilungDto): Promise<AbteilungResponseDto>;
    remove(id: string): Promise<void>;
}
