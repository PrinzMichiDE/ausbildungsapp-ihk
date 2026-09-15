import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { RagService } from '../ai/rag.service.js';
import { GenerateFromDocDto, UploadAiDocumentDto } from './dto/learning-content.dto.js';
export declare class AiImportService {
    private readonly prisma;
    private readonly ai;
    private readonly rag;
    private readonly logger;
    private readonly qualityThreshold;
    constructor(prisma: PrismaService, ai: AiService, rag: RagService, configService: ConfigService);
    uploadDocument(dto: UploadAiDocumentDto): Promise<{
        id: string;
        status: string;
    }>;
    indexDocument(documentId: string): Promise<{
        chunks: number;
    }>;
    generateFromDoc(dto: GenerateFromDocDto): Promise<{
        frameworks: number;
        courses: number;
        tasks: number;
        autoReleased: number;
    }>;
    private buildSystemPrompt;
    private buildUserPrompt;
    private scoreCourse;
    private validatePayload;
    private requireString;
    private requireNumber;
}
