export default () => ({
    env: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
    apiPrefix: process.env.API_PREFIX ?? 'api',
    cors: {
        origin: (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean),
    },
    database: {
        url: process.env.DATABASE_URL ?? 'postgresql://app:app@localhost:5432/nextgen',
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? 'change-me-in-production',
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
    ai: {
        provider: process.env.AI_PROVIDER ?? 'ollama',
        baseUrl: process.env.AI_BASE_URL ?? 'http://localhost:11434',
        apiKey: process.env.AI_API_KEY ?? '',
        model: process.env.AI_MODEL ?? 'llama3.1',
        embeddingModel: process.env.AI_EMBEDDING_MODEL ?? 'nomic-embed-text',
        embeddingDimensions: Number(process.env.AI_EMBEDDING_DIMENSIONS ?? 768),
        qualityThreshold: Number(process.env.AI_QUALITY_THRESHOLD ?? 85),
    },
    teams: {
        webhookUrl: process.env.TEAMS_WEBHOOK_URL ?? '',
    },
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 12),
});
//# sourceMappingURL=configuration.js.map