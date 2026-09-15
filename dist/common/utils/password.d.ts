import { ConfigService } from '@nestjs/config';
export declare function hashPassword(password: string, configService?: ConfigService): Promise<string>;
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
