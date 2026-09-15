import { AlumniService } from "./alumni.service.js";
export declare class AlumniController {
    private s;
    constructor(s: AlumniService);
    create(dto: any): import("@prisma/client").Prisma.Prisma__AlumniClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        austrittAm: Date;
        loeschungAm: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        austrittAm: Date;
        loeschungAm: Date | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__AlumniClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        austrittAm: Date;
        loeschungAm: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
