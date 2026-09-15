const REQUIRED_VARS = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
    'AI_PROVIDER',
    'CORS_ORIGINS',
];
export function validateEnv() {
    const missing = [];
    for (const key of REQUIRED_VARS) {
        const value = process.env[key];
        if (value === undefined || value === null || value.trim() === '') {
            missing.push(key);
        }
    }
    if (missing.length > 0) {
        throw new Error(`Umgebungsvariablen fehlen oder sind leer: ${missing.join(', ')}`);
    }
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        AI_PROVIDER: process.env.AI_PROVIDER,
        CORS_ORIGINS: process.env.CORS_ORIGINS,
    };
}
//# sourceMappingURL=env.validation.js.map