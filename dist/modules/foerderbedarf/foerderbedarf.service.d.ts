import { PrismaService } from "../../database/prisma.service.js";
export declare class FoerderbedarfService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): import("@prisma/client").Prisma.Prisma__FoerderbedarfClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        beschreibung: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVon: string | null;
        gradeEntryId: string | null;
        massnahme: import("@prisma/client").$Enums.FoerderMassnahme;
        ergebnis: string | null;
        nachverfolgungAm: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        azubiId: string;
        createdAt: Date;
        beschreibung: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVon: string | null;
        gradeEntryId: string | null;
        massnahme: import("@prisma/client").$Enums.FoerderMassnahme;
        ergebnis: string | null;
        nachverfolgungAm: Date | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__FoerderbedarfClient<{
        id: string;
        azubiId: string;
        createdAt: Date;
        beschreibung: string | null;
        durchgefuehrtAm: Date | null;
        durchgefuehrtVon: string | null;
        gradeEntryId: string | null;
        massnahme: import("@prisma/client").$Enums.FoerderMassnahme;
        ergebnis: string | null;
        nachverfolgungAm: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
