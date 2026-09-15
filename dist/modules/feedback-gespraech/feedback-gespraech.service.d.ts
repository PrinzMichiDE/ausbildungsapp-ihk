import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateFeedbackGespraechDto, UpdateFeedbackGespraechDto, CreateVereinbarungDto } from './dto/feedback-gespraech.dto.js';
export declare class FeedbackGespraechService {
    private prisma;
    private scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    private canManage;
    create(user: CurrentUser, dto: CreateFeedbackGespraechDto): Promise<{
        vereinbarungen: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.VereinbarungStatus;
            text: string;
            faelligAm: Date | null;
            gespraechId: string;
        }[];
    } & {
        id: string;
        azubiId: string;
        createdAt: Date;
        updatedAt: Date;
        typ: import("@prisma/client").$Enums.FeedbackGespraechTyp;
        status: import("@prisma/client").$Enums.FeedbackGespraechStatus;
        termin: Date | null;
        ziele: string | null;
        sichtbarkeitAzubi: boolean;
        verlaufsnotiz: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVonId: string;
    }>;
    findAll(user: CurrentUser): Promise<({
        vereinbarungen: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.VereinbarungStatus;
            text: string;
            faelligAm: Date | null;
            gespraechId: string;
        }[];
    } & {
        id: string;
        azubiId: string;
        createdAt: Date;
        updatedAt: Date;
        typ: import("@prisma/client").$Enums.FeedbackGespraechTyp;
        status: import("@prisma/client").$Enums.FeedbackGespraechStatus;
        termin: Date | null;
        ziele: string | null;
        sichtbarkeitAzubi: boolean;
        verlaufsnotiz: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVonId: string;
    })[]>;
    findOne(id: string, user: CurrentUser): Promise<({
        vereinbarungen: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.VereinbarungStatus;
            text: string;
            faelligAm: Date | null;
            gespraechId: string;
        }[];
    } & {
        id: string;
        azubiId: string;
        createdAt: Date;
        updatedAt: Date;
        typ: import("@prisma/client").$Enums.FeedbackGespraechTyp;
        status: import("@prisma/client").$Enums.FeedbackGespraechStatus;
        termin: Date | null;
        ziele: string | null;
        sichtbarkeitAzubi: boolean;
        verlaufsnotiz: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVonId: string;
    }) | {
        id: string;
        azubiId: string;
        status: import("@prisma/client").$Enums.FeedbackGespraechStatus;
        termin: Date | null;
    }>;
    update(id: string, user: CurrentUser, dto: UpdateFeedbackGespraechDto): Promise<{
        vereinbarungen: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.VereinbarungStatus;
            text: string;
            faelligAm: Date | null;
            gespraechId: string;
        }[];
    } & {
        id: string;
        azubiId: string;
        createdAt: Date;
        updatedAt: Date;
        typ: import("@prisma/client").$Enums.FeedbackGespraechTyp;
        status: import("@prisma/client").$Enums.FeedbackGespraechStatus;
        termin: Date | null;
        ziele: string | null;
        sichtbarkeitAzubi: boolean;
        verlaufsnotiz: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVonId: string;
    }>;
    addVereinbarung(id: string, user: CurrentUser, dto: CreateVereinbarungDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.VereinbarungStatus;
        text: string;
        faelligAm: Date | null;
        gespraechId: string;
    }>;
    completeVereinbarung(gespraechId: string, vereinbarungId: string, user: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.VereinbarungStatus;
        text: string;
        faelligAm: Date | null;
        gespraechId: string;
    }>;
    private scopeWhere;
}
