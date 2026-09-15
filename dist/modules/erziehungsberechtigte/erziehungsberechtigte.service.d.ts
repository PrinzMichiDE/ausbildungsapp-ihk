import { PrismaService } from "../../database/prisma.service.js";
import { AccessScopeService } from "../../common/rbac/access-scope.service.js";
import { CurrentUser } from "../../common/decorators/current-user.type.js";
export declare class ErziehungsberechtigteService {
    private prisma;
    private scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(u: CurrentUser, dto: any): Promise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        name: string;
        email: string | null;
        aktiv: boolean;
        bezug: import("@prisma/client").$Enums.ErziehungsBezug;
        telefon: string | null;
        berechtigungen: string[];
    }>;
    findAll(u: CurrentUser): Promise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        name: string;
        email: string | null;
        aktiv: boolean;
        bezug: import("@prisma/client").$Enums.ErziehungsBezug;
        telefon: string | null;
        berechtigungen: string[];
    }[]>;
}
