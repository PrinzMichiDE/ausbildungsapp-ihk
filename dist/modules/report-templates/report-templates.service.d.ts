import { PrismaService } from "../../database/prisma.service.js";
export declare class ReporttemplateService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: any): import("@prisma/client").Prisma.Prisma__ReportTemplateClient<{
        id: string;
        createdAt: Date;
        name: string;
        jahr: number;
        version: number;
        beruf: import("@prisma/client").$Enums.Ausbildungsberuf;
        felder: import("@prisma/client/runtime/library").JsonValue;
        istStandard: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        jahr: number;
        version: number;
        beruf: import("@prisma/client").$Enums.Ausbildungsberuf;
        felder: import("@prisma/client/runtime/library").JsonValue;
        istStandard: boolean;
    }[]>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__ReportTemplateClient<{
        id: string;
        createdAt: Date;
        name: string;
        jahr: number;
        version: number;
        beruf: import("@prisma/client").$Enums.Ausbildungsberuf;
        felder: import("@prisma/client/runtime/library").JsonValue;
        istStandard: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
