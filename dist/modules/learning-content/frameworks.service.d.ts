import { PrismaService } from '../../database/prisma.service.js';
import { CreateFrameworkDto, FrameworkResponseDto, UpdateFrameworkDto } from './dto/learning-content.dto.js';
export declare class FrameworksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateFrameworkDto): Promise<FrameworkResponseDto>;
    findAll(): Promise<FrameworkResponseDto[]>;
    findOne(id: string): Promise<FrameworkResponseDto>;
    getTree(id: string): Promise<{
        framework: FrameworkResponseDto;
        courses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            titel: string;
            beschreibung: string | null;
            freigegeben: boolean;
            frameworkId: string;
            lernziele: string[];
            theorie: string | null;
            kiGeneriert: boolean;
            qualitaetsScore: number | null;
        }[];
        tasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            titel: string;
            beschreibung: string | null;
            freigegeben: boolean;
            frameworkId: string;
            courseId: string | null;
            musterloesung: string | null;
            kiGeneriert: boolean;
        }[];
    }>;
    update(id: string, dto: UpdateFrameworkDto): Promise<FrameworkResponseDto>;
    remove(id: string): Promise<void>;
    private toResponse;
}
