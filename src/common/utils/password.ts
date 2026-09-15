import bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration.js';

let cachedRounds: number | null = null;

function getRounds(configService?: ConfigService): number {
  if (cachedRounds !== null) {
    return cachedRounds;
  }
  if (configService) {
    cachedRounds = (configService.get<AppConfig['bcryptRounds']>('bcryptRounds') as number) ?? 12;
    return cachedRounds;
  }
  return 12;
}

export async function hashPassword(
  password: string,
  configService?: ConfigService,
): Promise<string> {
  return bcrypt.hash(password, getRounds(configService));
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
