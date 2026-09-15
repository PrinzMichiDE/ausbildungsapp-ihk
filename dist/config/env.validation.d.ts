interface RequiredEnv {
    NODE_ENV: string;
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    AI_PROVIDER: string;
    CORS_ORIGINS: string;
}
export declare function validateEnv(): RequiredEnv;
export {};
