import { VersetzungswunschService } from "./versetzungswunsch.service.js";
export declare class VersetzungswunschController {
    private s;
    constructor(s: VersetzungswunschService);
    create(dto: any): import("@prisma/client").Prisma.Prisma__VersetzungswunschClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        wunschAbteilungen: string[];
        begruendung: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        wunschAbteilungen: string[];
        begruendung: string | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__VersetzungswunschClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        wunschAbteilungen: string[];
        begruendung: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
