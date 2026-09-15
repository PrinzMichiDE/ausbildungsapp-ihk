import { PrismaService } from "../../database/prisma.service.js";
export declare class BerufsschuleService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): import("@prisma/client").Prisma.Prisma__BerufsschuleClient<{
        id: string;
        createdAt: Date;
        name: string;
        adresse: string | null;
        klasse: string | null;
        klassenlehrer: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        adresse: string | null;
        klasse: string | null;
        klassenlehrer: string | null;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__BerufsschuleClient<{
        id: string;
        createdAt: Date;
        name: string;
        adresse: string | null;
        klasse: string | null;
        klassenlehrer: string | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
