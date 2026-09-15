import { PrismaService } from '../../database/prisma.service.js';
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    search(q: string): Promise<{
        reports: {
            id: string;
            azubiId: string;
            createdAt: Date;
            updatedAt: Date;
            titel: string;
            typ: import("@prisma/client").$Enums.ReportTyp;
            kalenderwoche: number;
            jahr: number;
            datumVon: Date;
            datumBis: Date;
            inhaltMarkdown: string;
            status: import("@prisma/client").$Enums.ReportStatus;
            signiertVon: string | null;
            signiertAm: Date | null;
            archiviertAm: Date | null;
        }[];
        wiki: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            titel: string;
            inhaltMarkdown: string;
            slug: string;
            kategorie: string | null;
        }[];
        courses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            titel: string;
            beschreibung: string | null;
            freigegeben: boolean;
            frameworkId: string;
            lernziele: string[];
            theorie: string | null;
            kiGeneriert: boolean;
            qualitaetsScore: number | null;
        }[];
    }>;
}
