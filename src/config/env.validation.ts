interface RequiredEnv {
  NODE_ENV: string;
  PORT: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  AI_PROVIDER: string;
  CORS_ORIGINS: string;
}

const REQUIRED_VARS: ReadonlyArray<keyof RequiredEnv> = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'AI_PROVIDER',
  'CORS_ORIGINS',
];

export function validateEnv(): RequiredEnv {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    const value = process.env[key];
    if (value === undefined || value === null || value.trim() === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Umgebungsvariablen fehlen oder sind leer: ${missing.join(', ')}`,
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    AI_PROVIDER: process.env.AI_PROVIDER as string,
    CORS_ORIGINS: process.env.CORS_ORIGINS as string,
  };
}
