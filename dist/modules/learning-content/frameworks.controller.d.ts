import { FrameworksService } from './frameworks.service.js';
import { CreateFrameworkDto, FrameworkResponseDto, UpdateFrameworkDto } from './dto/learning-content.dto.js';
export declare class FrameworksController {
    private readonly service;
    constructor(service: FrameworksService);
    create(dto: CreateFrameworkDto): Promise<FrameworkResponseDto>;
    findAll(): Promise<FrameworkResponseDto[]>;
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
    findOne(id: string): Promise<FrameworkResponseDto>;
    update(id: string, dto: UpdateFrameworkDto): Promise<FrameworkResponseDto>;
    remove(id: string): Promise<void>;
}
