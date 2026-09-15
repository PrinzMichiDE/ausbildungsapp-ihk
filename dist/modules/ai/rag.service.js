var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RagService_1;
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from './ai.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
let RagService = RagService_1 = class RagService {
    prisma;
    ai;
    logger = new Logger(RagService_1.name);
    constructor(prisma, ai) {
        this.prisma = prisma;
        this.ai = ai;
    }
    splitIntoChunks(text, size = 1000, overlap = 100) {
        const clean = text.replace(/\s+/g, ' ').trim();
        if (clean.length === 0) {
            return [];
        }
        if (clean.length <= size) {
            return [clean];
        }
        const chunks = [];
        let start = 0;
        while (start < clean.length) {
            const end = Math.min(start + size, clean.length);
            chunks.push(clean.slice(start, end));
            if (end === clean.length) {
                break;
            }
            start = end - overlap;
        }
        return chunks;
    }
    async indexDocument(documentId) {
        const document = await this.prisma.aiDocument.findUnique({
            where: { id: documentId },
        });
        if (!document) {
            throw new BusinessException(ERROR_CODES.NOT_FOUND, `Dokument ${documentId} nicht gefunden`, 404);
        }
        const chunks = this.splitIntoChunks(document.inhalt);
        await this.prisma.aiDocumentChunk.deleteMany({
            where: { documentId },
        });
        let indexed = 0;
        for (const chunk of chunks) {
            const embedding = await this.ai.embed(chunk);
            await this.prisma.aiDocumentChunk.create({
                data: { documentId, inhalt: chunk, embedding },
            });
            indexed += 1;
        }
        await this.prisma.aiDocument.update({
            where: { id: documentId },
            data: { status: 'vektorisiert' },
        });
        this.logger.log(`Dokument ${documentId} vektorisiert (${indexed} Chunks)`);
        return indexed;
    }
    async retrieveContext(query, documentIds, topK = 5) {
        const queryEmbedding = await this.ai.embed(query);
        const where = documentIds ? { documentId: { in: [...documentIds] } } : {};
        const chunks = await this.prisma.aiDocumentChunk.findMany({ where });
        if (chunks.length === 0) {
            return '';
        }
        const scored = chunks
            .map((chunk) => ({
            text: chunk.inhalt,
            score: this.cosine(queryEmbedding, chunk.embedding),
        }))
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topK)
            .map((entry) => entry.text);
        if (scored.length === 0) {
            return chunks.slice(0, topK).map((c) => c.inhalt).join('\n\n');
        }
        return scored.join('\n\n');
    }
    cosine(a, b) {
        if (a.length === 0 || b.length === 0 || a.length !== b.length) {
            return 0;
        }
        let dot = 0;
        let normA = 0;
        let normB = 0;
        for (let i = 0; i < a.length; i += 1) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA === 0 || normB === 0) {
            return 0;
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
};
RagService = RagService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AiService])
], RagService);
export { RagService };
//# sourceMappingURL=rag.service.js.map