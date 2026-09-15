import { PrismaService } from '../../database/prisma.service.js';
import { AbteilungResponseDto, CreateAbteilungDto, UpdateAbteilungDto } from './dto/abteilung.dto.js';
export declare class AbteilungenService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAbteilungDto): Promise<AbteilungResponseDto>;
    findAll(): Promise<AbteilungResponseDto[]>;
    findOne(id: string): Promise<AbteilungResponseDto>;
    update(id: string, dto: UpdateAbteilungDto): Promise<AbteilungResponseDto>;
    remove(id: string): Promise<void>;
    private toResponse;
}
