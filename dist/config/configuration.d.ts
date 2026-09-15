export interface AppConfig {
    env: string;
    port: number;
    apiPrefix: string;
    cors: {
        origin: string[];
    };
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    ai: {
        provider: 'ollama' | 'openrouter' | 'openai';
        baseUrl: string;
        apiKey: string;
        model: string;
        embeddingModel: string;
        embeddingDimensions: number;
        qualityThreshold: number;
    };
    teams: {
        webhookUrl: string;
    };
    bcryptRounds: number;
}
declare const _default: () => AppConfig;
export default _default;
