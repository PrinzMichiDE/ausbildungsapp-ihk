var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiImportService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { RagService } from '../ai/rag.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
let AiImportService = AiImportService_1 = class AiImportService {
    prisma;
    ai;
    rag;
    logger = new Logger(AiImportService_1.name);
    qualityThreshold;
    constructor(prisma, ai, rag, configService) {
        this.prisma = prisma;
        this.ai = ai;
        this.rag = rag;
        const aiConfig = configService.get('ai');
        this.qualityThreshold = aiConfig?.qualityThreshold ?? 85;
    }
    async uploadDocument(dto) {
        const document = await this.prisma.aiDocument.create({
            data: {
                filename: dto.filename,
                quelle: dto.quelle,
                inhalt: dto.inhalt,
                status: 'importiert',
            },
        });
        return { id: document.id, status: document.status };
    }
    async indexDocument(documentId) {
        const chunks = await this.rag.indexDocument(documentId);
        return { chunks };
    }
    async generateFromDoc(dto) {
        const document = await this.prisma.aiDocument.findUnique({
            where: { id: dto.documentId },
        });
        if (!document || document.status !== 'vektorisiert') {
            throw new BusinessException(ERROR_CODES.RAG_NO_CONTEXT, 'Dokument muss zuerst vektorisiert werden', 409);
        }
        const context = await this.rag.retrieveContext('Erstelle Lernfelder, Kurse und betriebliche Praxisaufgaben aus dem IHK-Ausbildungsrahmenplan.', [dto.documentId]);
        const payload = await this.ai.completeJson(this.buildSystemPrompt(), this.buildUserPrompt(context));
        const validated = this.validatePayload(payload);
        let autoReleased = 0;
        const result = await this.prisma.$transaction(async (tx) => {
            const frameworkIds = [];
            for (const fw of validated.frameworks) {
                const created = await tx.framework.create({
                    data: {
                        titel: fw.titel,
                        lernfeld: fw.lernfeld,
                        kompetenz: fw.kompetenz,
                        quelle: document.filename,
                    },
                });
                frameworkIds.push(created.id);
            }
            const courseIds = [];
            for (const co of validated.courses) {
                const frameworkId = frameworkIds[co.frameworkIndex];
                if (!frameworkId) {
                    throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, 'course.frameworkIndex verweist auf unbekanntes Framework', 502);
                }
                const qualitaetsScore = await this.scoreCourse(co);
                const freigegeben = qualitaetsScore >= this.qualityThreshold;
                if (freigegeben) {
                    autoReleased++;
                }
                const created = await tx.course.create({
                    data: {
                        frameworkId,
                        titel: co.titel,
                        beschreibung: co.beschreibung,
                        lernziele: co.lernziele ?? [],
                        theorie: co.theorie,
                        freigegeben,
                        kiGeneriert: true,
                        qualitaetsScore,
                    },
                });
                courseIds.push(created.id);
            }
            for (const ta of validated.tasks) {
                const frameworkId = frameworkIds[ta.frameworkIndex];
                if (!frameworkId) {
                    throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, 'task.frameworkIndex verweist auf unbekanntes Framework', 502);
                }
                const courseId = ta.courseIndex !== undefined ? courseIds[ta.courseIndex] : undefined;
                await tx.task.create({
                    data: {
                        frameworkId,
                        courseId,
                        titel: ta.titel,
                        beschreibung: ta.beschreibung,
                        musterloesung: ta.musterloesung,
                        freigegeben: false,
                        kiGeneriert: true,
                    },
                });
            }
            return {
                frameworks: validated.frameworks.length,
                courses: validated.courses.length,
                tasks: validated.tasks.length,
                autoReleased,
            };
        });
        this.logger.log(`KI-Generierung abgeschlossen: ${result.courses} Kurse, ${result.tasks} Tasks, ${autoReleased} auto-freigegeben (Schwellwert: ${this.qualityThreshold})`);
        return result;
    }
    buildSystemPrompt() {
        return [
            'Du bist ein erfahrener Ausbildungsplaner für Fachinformatiker.',
            'Übersetze einen IHK-Ausbildungsrahmenplan in greifbare Lernpfade.',
            'Antworte AUSSCHLIESSLICH mit einem JSON-Objekt (kein Markdown, kein Text davor/danach) mit genau dieser Struktur:',
            '{',
            '  "frameworks": [{"titel": string, "lernfeld": string, "kompetenz": string}],',
            '  "courses": [{"frameworkIndex": number, "titel": string, "beschreibung": string, "lernziele": string[], "theorie": string}],',
            '  "tasks": [{"frameworkIndex": number, "courseIndex": number, "titel": string, "beschreibung": string, "musterloesung": string}]',
            '}',
            'frameworkIndex/courseIndex referenzieren die Position (0-basiert) in den jeweiligen Arrays.',
        ].join('\n');
    }
    buildUserPrompt(context) {
        return [
            'IHK-RAHMENPLAN (Ground Truth, nicht erfinden):',
            '---------------------------------------------',
            context,
            '---------------------------------------------',
            'Erzeuge darauf basierend frameworks, courses und tasks. Jede Kompetenz bekommt mindestens einen Kurs und eine konkrete betriebliche Praxisaufgabe.',
        ].join('\n');
    }
    async scoreCourse(course) {
        try {
            const scorePrompt = [
                'Bewerte den folgenden Kurs auf einer Skala von 0-100 Punkten.',
                'Bewertungskriterien:',
                '- Fachliche Korrektheit (30 Punkte)',
                '- Vollständigkeit der Lernziele (25 Punkte)',
                '- Praxisbezug (25 Punkte)',
                '- Verständlichkeit (20 Punkte)',
                '',
                'Antworte NUR mit einem JSON-Objekt: {"score": <number>, "begründung": "<kurze Begründung>"}',
                '',
                'Kurs:',
                `Titel: ${course.titel}`,
                `Beschreibung: ${course.beschreibung ?? 'Keine'}`,
                `Lernziele: ${(course.lernziele ?? []).join(', ')}`,
                `Theorie: ${course.theorie?.substring(0, 500) ?? 'Keine'}`,
            ].join('\n');
            const result = await this.ai.completeJson('Du bist ein Bewertungsexpertur für Ausbildungsinhalte.', scorePrompt);
            const obj = result;
            if (typeof obj.score === 'number' && obj.score >= 0 && obj.score <= 100) {
                return Math.round(obj.score);
            }
            return this.qualityThreshold - 1;
        }
        catch {
            this.logger.warn(`Bewertung fehlgeschlagen für Kurs "${course.titel}", verwende Standard`);
            return this.qualityThreshold - 1;
        }
    }
    validatePayload(payload) {
        if (typeof payload !== 'object' || payload === null) {
            throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, 'KI-Antwort ist kein Objekt', 502);
        }
        const obj = payload;
        if (!Array.isArray(obj.frameworks) || !Array.isArray(obj.courses) || !Array.isArray(obj.tasks)) {
            throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, 'KI-Antwort enthält nicht frameworks/courses/tasks', 502);
        }
        const frameworks = obj.frameworks.map((entry, index) => {
            const fw = entry;
            this.requireString(fw.titel, `frameworks[${index}].titel`);
            this.requireString(fw.lernfeld, `frameworks[${index}].lernfeld`);
            this.requireString(fw.kompetenz, `frameworks[${index}].kompetenz`);
            return {
                titel: String(fw.titel),
                lernfeld: String(fw.lernfeld),
                kompetenz: String(fw.kompetenz),
            };
        });
        const courses = obj.courses.map((entry, index) => {
            const co = entry;
            this.requireNumber(co.frameworkIndex, `courses[${index}].frameworkIndex`);
            this.requireString(co.titel, `courses[${index}].titel`);
            return {
                frameworkIndex: Number(co.frameworkIndex),
                titel: String(co.titel),
                beschreibung: typeof co.beschreibung === 'string' ? co.beschreibung : undefined,
                lernziele: Array.isArray(co.lernziele)
                    ? co.lernziele.map(String)
                    : undefined,
                theorie: typeof co.theorie === 'string' ? co.theorie : undefined,
            };
        });
        const tasks = obj.tasks.map((entry, index) => {
            const ta = entry;
            this.requireNumber(ta.frameworkIndex, `tasks[${index}].frameworkIndex`);
            this.requireString(ta.titel, `tasks[${index}].titel`);
            return {
                frameworkIndex: Number(ta.frameworkIndex),
                courseIndex: typeof ta.courseIndex === 'number' ? Number(ta.courseIndex) : undefined,
                titel: String(ta.titel),
                beschreibung: typeof ta.beschreibung === 'string' ? ta.beschreibung : undefined,
                musterloesung: typeof ta.musterloesung === 'string' ? ta.musterloesung : undefined,
            };
        });
        return { frameworks, courses, tasks };
    }
    requireString(value, path) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, `Feld ${path} muss ein nicht-leerer String sein`, 502);
        }
    }
    requireNumber(value, path) {
        if (typeof value !== 'number' || Number.isNaN(value)) {
            throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, `Feld ${path} muss eine Zahl sein`, 502);
        }
    }
};
AiImportService = AiImportService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        AiService,
        RagService,
        ConfigService])
], AiImportService);
export { AiImportService };
//# sourceMappingURL=ai-import.service.js.map