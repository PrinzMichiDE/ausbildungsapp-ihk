import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from './ai.service.js';
export declare class RagService {
    private readonly prisma;
    private readonly ai;
    private readonly logger;
    constructor(prisma: PrismaService, ai: AiService);
    splitIntoChunks(text: string, size?: number, overlap?: number): string[];
    indexDocument(documentId: string): Promise<number>;
    retrieveContext(query: string, documentIds?: ReadonlyArray<string>, topK?: number): Promise<string>;
    private cosine;
}
