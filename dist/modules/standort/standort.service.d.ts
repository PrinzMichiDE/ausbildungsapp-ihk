import { PrismaService } from '../../database/prisma.service.js';
import { CreateStandortDto, UpdateStandortDto, StandortResponseDto } from './dto/standort.dto.js';
export declare class StandortService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<StandortResponseDto[]>;
    findOne(id: string): Promise<StandortResponseDto>;
    create(dto: CreateStandortDto): Promise<StandortResponseDto>;
    update(id: string, dto: UpdateStandortDto): Promise<StandortResponseDto>;
    remove(id: string): Promise<void>;
    private toResponse;
}
