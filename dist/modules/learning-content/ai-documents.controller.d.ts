import { AiImportService } from './ai-import.service.js';
import { GenerateFromDocDto, UploadAiDocumentDto } from './dto/learning-content.dto.js';
export declare class AiDocumentsController {
    private readonly service;
    constructor(service: AiImportService);
    upload(dto: UploadAiDocumentDto): Promise<{
        id: string;
        status: string;
    }>;
    index(id: string): Promise<{
        chunks: number;
    }>;
    generate(dto: GenerateFromDocDto): Promise<{
        frameworks: number;
        courses: number;
        tasks: number;
        autoReleased: number;
    }>;
}
