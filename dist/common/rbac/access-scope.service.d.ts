import { PrismaService } from '../../database/prisma.service.js';
import { CurrentUser } from '../decorators/current-user.type.js';
declare const ALLE: "ALL";
type Scope = ReadonlyArray<string> | typeof ALLE;
export declare class AccessScopeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getVisibleAzubiIds(user: CurrentUser): Promise<Scope>;
    private findActiveAzubiIdsForAbteilungen;
    isAzubiVisible(user: CurrentUser, azubiId: string): Promise<boolean>;
    assertCanAccessAzubi(user: CurrentUser, azubiId: string): Promise<void>;
    assertCanAccessBericht(user: CurrentUser, berichtId: string): Promise<void>;
}
export {};
