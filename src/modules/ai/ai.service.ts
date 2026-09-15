import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration.js';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';

interface ChatResult {
  content: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly config: AppConfig['ai'];
  private readonly timeoutMs = 120_000;

  constructor(configService: ConfigService) {
    this.config = configService.get<AppConfig['ai']>('ai') as AppConfig['ai'];
  }

  async completeJson(systemPrompt: string, userPrompt: string): Promise<unknown> {
    const raw = await this.complete(systemPrompt, userPrompt);
    return this.parseJson(raw);
  }

  private async complete(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    try {
      switch (this.config.provider) {
        case 'ollama':
          return await this.completeOllama(systemPrompt, userPrompt);
        case 'openai':
        case 'openrouter':
          return await this.completeOpenAi(systemPrompt, userPrompt);
        default:
          throw new BusinessException(
            ERROR_CODES.AI_GENERATION_FAILED,
            `Unbekannter AI-Provider: ${this.config.provider}`,
            502,
          );
      }
    } catch (error) {
      if (error instanceof BusinessException) {
        throw error;
      }
      this.logger.error('KI-Generierung fehlgeschlagen', {
        provider: this.config.provider,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BusinessException(
        ERROR_CODES.AI_GENERATION_FAILED,
        'KI-Generierung konnte nicht ausgeführt werden',
        502,
      );
    }
  }

  private async completeOllama(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    const response = await this.post(`${this.config.baseUrl}/api/generate`, {
      model: this.config.model,
      prompt,
      format: 'json',
      stream: false,
    });
    const body = (await response.json()) as { response?: string };
    return body.response ?? '';
  }

  private async completeOpenAi(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<string> {
    const url = `${this.config.baseUrl}/v1/chat/completions`;
    const response = await this.post(
      url,
      {
        model: this.config.model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      },
      { Authorization: `Bearer ${this.config.apiKey}` },
    );
    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    return body.choices?.[0]?.message?.content ?? '';
  }

  async embed(text: string): Promise<number[]> {
    try {
      switch (this.config.provider) {
        case 'ollama':
          return await this.embedOllama(text);
        case 'openai':
        case 'openrouter':
          return await this.embedOpenAi(text);
        default:
          return [];
      }
    } catch (error) {
      this.logger.warn('Embedding fehlgeschlagen, leeres Vektorfeld', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  private async embedOllama(text: string): Promise<number[]> {
    const response = await this.post(`${this.config.baseUrl}/api/embed`, {
      model: this.config.embeddingModel,
      input: text,
    });
    const body = (await response.json()) as {
      embeddings?: number[][];
      embedding?: number[];
    };
    if (Array.isArray(body.embeddings) && body.embeddings.length > 0) {
      return body.embeddings[0];
    }
    return body.embedding ?? [];
  }

  private async embedOpenAi(text: string): Promise<number[]> {
    const response = await this.post(
      `${this.config.baseUrl}/v1/embeddings`,
      { model: this.config.embeddingModel, input: text },
      { Authorization: `Bearer ${this.config.apiKey}` },
    );
    const body = (await response.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    return body.data?.[0]?.embedding ?? [];
  }

  private async post(
    url: string,
    body: unknown,
    headers: Record<string, string> = {},
  ): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response;
    } finally {
      clearTimeout(timer);
    }
  }

  private parseJson(raw: string): unknown {
    const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '');
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new BusinessException(
        ERROR_CODES.AI_INVALID_RESPONSE,
        'KI-Antwort ist kein gültiges JSON',
        502,
      );
    }
  }
}

export type { ChatResult };
