import { FeedbackGespraechService } from './feedback-gespraech.service.js';
import { CreateFeedbackGespraechDto, UpdateFeedbackGespraechDto, CreateVereinbarungDto } from './dto/feedback-gespraech.dto.js';
export declare class FeedbackGespraechController {
    private svc;
    constructor(svc: FeedbackGespraechService);
    create(u: any, dto: CreateFeedbackGespraechDto): Promise<{
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
    findAll(u: any): Promise<({
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
    findOne(u: any, id: string): Promise<({
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
    update(u: any, id: string, dto: UpdateFeedbackGespraechDto): Promise<{
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
    addVereinbarung(u: any, id: string, dto: CreateVereinbarungDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.VereinbarungStatus;
        text: string;
        faelligAm: Date | null;
        gespraechId: string;
    }>;
    complete(u: any, id: string, vid: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.VereinbarungStatus;
        text: string;
        faelligAm: Date | null;
        gespraechId: string;
    }>;
}
