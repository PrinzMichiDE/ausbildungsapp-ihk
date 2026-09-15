import { PrismaService } from "../../database/prisma.service.js";
export declare class UebernahmegespraechService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): import("@prisma/client").Prisma.Prisma__UebernahmeGespraechClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        termin: Date | null;
        ergebnis: import("@prisma/client").$Enums.UebernahmeErgebnis;
        hrId: string | null;
        notizen: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        termin: Date | null;
        ergebnis: import("@prisma/client").$Enums.UebernahmeErgebnis;
        hrId: string | null;
        notizen: string | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__UebernahmeGespraechClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        termin: Date | null;
        ergebnis: import("@prisma/client").$Enums.UebernahmeErgebnis;
        hrId: string | null;
        notizen: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
