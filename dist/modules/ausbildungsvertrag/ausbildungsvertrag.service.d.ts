import { PrismaService } from "../../database/prisma.service.js";
import { AccessScopeService } from "../../common/rbac/access-scope.service.js";
import { CurrentUser } from "../../common/decorators/current-user.type.js";
export declare class AusbildungsvertragService {
    private prisma;
    private scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    create(u: CurrentUser, dto: any): Promise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.VertragsStatus;
        version: number;
        beruf: import("@prisma/client").$Enums.Ausbildungsberuf;
        startdatum: Date;
        enddatum: Date;
        probezeitMonate: number;
        dauerMonate: number;
        verkuerzungMonate: number | null;
        verlaengerungGrund: string | null;
        vertragsUrl: string | null;
    }>;
    findAll(u: CurrentUser): Promise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.VertragsStatus;
        version: number;
        beruf: import("@prisma/client").$Enums.Ausbildungsberuf;
        startdatum: Date;
        enddatum: Date;
        probezeitMonate: number;
        dauerMonate: number;
        verkuerzungMonate: number | null;
        verlaengerungGrund: string | null;
        vertragsUrl: string | null;
    }[]>;
}
