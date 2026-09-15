import { ConfigService } from '@nestjs/config';
interface ChatResult {
    content: string;
}
export declare class AiService {
    private readonly logger;
    private readonly config;
    private readonly timeoutMs;
    constructor(configService: ConfigService);
    completeJson(systemPrompt: string, userPrompt: string): Promise<unknown>;
    private complete;
    private completeOllama;
    private completeOpenAi;
    embed(text: string): Promise<number[]>;
    private embedOllama;
    private embedOpenAi;
    private post;
    private parseJson;
}
export type { ChatResult };
