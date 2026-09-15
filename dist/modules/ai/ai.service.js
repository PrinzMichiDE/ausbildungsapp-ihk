var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BusinessException } from '../../common/exceptions/business.exception.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let AiService = AiService_1 = class AiService {
    logger = new Logger(AiService_1.name);
    config;
    timeoutMs = 120_000;
    constructor(configService) {
        this.config = configService.get('ai');
    }
    async completeJson(systemPrompt, userPrompt) {
        const raw = await this.complete(systemPrompt, userPrompt);
        return this.parseJson(raw);
    }
    async complete(systemPrompt, userPrompt) {
        try {
            switch (this.config.provider) {
                case 'ollama':
                    return await this.completeOllama(systemPrompt, userPrompt);
                case 'openai':
                case 'openrouter':
                    return await this.completeOpenAi(systemPrompt, userPrompt);
                default:
                    throw new BusinessException(ERROR_CODES.AI_GENERATION_FAILED, `Unbekannter AI-Provider: ${this.config.provider}`, 502);
            }
        }
        catch (error) {
            if (error instanceof BusinessException) {
                throw error;
            }
            this.logger.error('KI-Generierung fehlgeschlagen', {
                provider: this.config.provider,
                error: error instanceof Error ? error.message : String(error),
            });
            throw new BusinessException(ERROR_CODES.AI_GENERATION_FAILED, 'KI-Generierung konnte nicht ausgeführt werden', 502);
        }
    }
    async completeOllama(systemPrompt, userPrompt) {
        const prompt = `${systemPrompt}\n\n${userPrompt}`;
        const response = await this.post(`${this.config.baseUrl}/api/generate`, {
            model: this.config.model,
            prompt,
            format: 'json',
            stream: false,
        });
        const body = (await response.json());
        return body.response ?? '';
    }
    async completeOpenAi(systemPrompt, userPrompt) {
        const url = `${this.config.baseUrl}/v1/chat/completions`;
        const response = await this.post(url, {
            model: this.config.model,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        }, { Authorization: `Bearer ${this.config.apiKey}` });
        const body = (await response.json());
        return body.choices?.[0]?.message?.content ?? '';
    }
    async embed(text) {
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
        }
        catch (error) {
            this.logger.warn('Embedding fehlgeschlagen, leeres Vektorfeld', {
                error: error instanceof Error ? error.message : String(error),
            });
            return [];
        }
    }
    async embedOllama(text) {
        const response = await this.post(`${this.config.baseUrl}/api/embed`, {
            model: this.config.embeddingModel,
            input: text,
        });
        const body = (await response.json());
        if (Array.isArray(body.embeddings) && body.embeddings.length > 0) {
            return body.embeddings[0];
        }
        return body.embedding ?? [];
    }
    async embedOpenAi(text) {
        const response = await this.post(`${this.config.baseUrl}/v1/embeddings`, { model: this.config.embeddingModel, input: text }, { Authorization: `Bearer ${this.config.apiKey}` });
        const body = (await response.json());
        return body.data?.[0]?.embedding ?? [];
    }
    async post(url, body, headers = {}) {
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
        }
        finally {
            clearTimeout(timer);
        }
    }
    parseJson(raw) {
        const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '');
        try {
            return JSON.parse(cleaned);
        }
        catch {
            throw new BusinessException(ERROR_CODES.AI_INVALID_RESPONSE, 'KI-Antwort ist kein gültiges JSON', 502);
        }
    }
};
AiService = AiService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], AiService);
export { AiService };
//# sourceMappingURL=ai.service.js.map