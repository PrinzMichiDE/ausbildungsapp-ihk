import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { RagService } from '../ai/rag.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { AppConfig } from '../../config/configuration.js';
import {
  GenerateFromDocDto,
  UploadAiDocumentDto,
} from './dto/learning-content.dto.js';

interface GeneratedFramework {
  titel: string;
  lernfeld: string;
  kompetenz: string;
}
interface GeneratedCourse {
  frameworkIndex: number;
  titel: string;
  beschreibung?: string;
  lernziele?: string[];
  theorie?: string;
}
interface GeneratedTask {
  frameworkIndex: number;
  courseIndex?: number;
  titel: string;
  beschreibung?: string;
  musterloesung?: string;
}
interface GeneratedPayload {
  frameworks: GeneratedFramework[];
  courses: GeneratedCourse[];
  tasks: GeneratedTask[];
}

@Injectable()
export class AiImportService {
  private readonly logger = new Logger(AiImportService.name);
  private readonly qualityThreshold: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
    private readonly rag: RagService,
    configService: ConfigService,
  ) {
    const aiConfig = configService.get<AppConfig['ai']>('ai') as AppConfig['ai'];
    this.qualityThreshold = aiConfig?.qualityThreshold ?? 85;
  }

  async uploadDocument(
    dto: UploadAiDocumentDto,
  ): Promise<{ id: string; status: string }> {
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

  async indexDocument(documentId: string): Promise<{ chunks: number }> {
    const chunks = await this.rag.indexDocument(documentId);
    return { chunks };
  }

  async generateFromDoc(
    dto: GenerateFromDocDto,
  ): Promise<{ frameworks: number; courses: number; tasks: number; autoReleased: number }> {
    const document = await this.prisma.aiDocument.findUnique({
      where: { id: dto.documentId },
    });
    if (!document || document.status !== 'vektorisiert') {
      throw new BusinessException(
        ERROR_CODES.RAG_NO_CONTEXT,
        'Dokument muss zuerst vektorisiert werden',
        409,
      );
    }

    const context = await this.rag.retrieveContext(
      'Erstelle Lernfelder, Kurse und betriebliche Praxisaufgaben aus dem IHK-Ausbildungsrahmenplan.',
      [dto.documentId],
    );

    const payload = await this.ai.completeJson(
      this.buildSystemPrompt(),
      this.buildUserPrompt(context),
    );

    const validated = this.validatePayload(payload);

    let autoReleased = 0;

    const result = await this.prisma.$transaction(async (tx) => {
      const frameworkIds: string[] = [];
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

      const courseIds: string[] = [];
      for (const co of validated.courses) {
        const frameworkId = frameworkIds[co.frameworkIndex];
        if (!frameworkId) {
          throw new BusinessException(
            ERROR_CODES.AI_INVALID_RESPONSE,
            'course.frameworkIndex verweist auf unbekanntes Framework',
            502,
          );
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
          throw new BusinessException(
            ERROR_CODES.AI_INVALID_RESPONSE,
            'task.frameworkIndex verweist auf unbekanntes Framework',
            502,
          );
        }
        const courseId =
          ta.courseIndex !== undefined ? courseIds[ta.courseIndex] : undefined;
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

    this.logger.log(
      `KI-Generierung abgeschlossen: ${result.courses} Kurse, ${result.tasks} Tasks, ${autoReleased} auto-freigegeben (Schwellwert: ${this.qualityThreshold})`,
    );

    return result;
  }

  private buildSystemPrompt(): string {
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

  private buildUserPrompt(context: string): string {
    return [
      'IHK-RAHMENPLAN (Ground Truth, nicht erfinden):',
      '---------------------------------------------',
      context,
      '---------------------------------------------',
      'Erzeuge darauf basierend frameworks, courses und tasks. Jede Kompetenz bekommt mindestens einen Kurs und eine konkrete betriebliche Praxisaufgabe.',
    ].join('\n');
  }

  private async scoreCourse(course: GeneratedCourse): Promise<number> {
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

      const result = await this.ai.completeJson(
        'Du bist ein Bewertungsexpertur für Ausbildungsinhalte.',
        scorePrompt,
      );

      const obj = result as Record<string, unknown>;
      if (typeof obj.score === 'number' && obj.score >= 0 && obj.score <= 100) {
        return Math.round(obj.score);
      }
      return this.qualityThreshold - 1;
    } catch {
      this.logger.warn(`Bewertung fehlgeschlagen für Kurs "${course.titel}", verwende Standard`);
      return this.qualityThreshold - 1;
    }
  }

  private validatePayload(payload: unknown): GeneratedPayload {
    if (typeof payload !== 'object' || payload === null) {
      throw new BusinessException(
        ERROR_CODES.AI_INVALID_RESPONSE,
        'KI-Antwort ist kein Objekt',
        502,
      );
    }
    const obj = payload as Record<string, unknown>;
    if (!Array.isArray(obj.frameworks) || !Array.isArray(obj.courses) || !Array.isArray(obj.tasks)) {
      throw new BusinessException(
        ERROR_CODES.AI_INVALID_RESPONSE,
        'KI-Antwort enthält nicht frameworks/courses/tasks',
        502,
      );
    }

    const frameworks = obj.frameworks.map((entry, index) => {
      const fw = entry as Record<string, unknown>;
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
      const co = entry as Record<string, unknown>;
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
      const ta = entry as Record<string, unknown>;
      this.requireNumber(ta.frameworkIndex, `tasks[${index}].frameworkIndex`);
      this.requireString(ta.titel, `tasks[${index}].titel`);
      return {
        frameworkIndex: Number(ta.frameworkIndex),
        courseIndex:
          typeof ta.courseIndex === 'number' ? Number(ta.courseIndex) : undefined,
        titel: String(ta.titel),
        beschreibung: typeof ta.beschreibung === 'string' ? ta.beschreibung : undefined,
        musterloesung:
          typeof ta.musterloesung === 'string' ? ta.musterloesung : undefined,
      };
    });

    return { frameworks, courses, tasks };
  }

  private requireString(value: unknown, path: string): void {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new BusinessException(
        ERROR_CODES.AI_INVALID_RESPONSE,
        `Feld ${path} muss ein nicht-leerer String sein`,
        502,
      );
    }
  }

  private requireNumber(value: unknown, path: string): void {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new BusinessException(
        ERROR_CODES.AI_INVALID_RESPONSE,
        `Feld ${path} muss eine Zahl sein`,
        502,
      );
    }
  }
}
