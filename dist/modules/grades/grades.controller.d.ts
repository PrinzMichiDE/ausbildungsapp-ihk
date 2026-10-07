import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { NotenService } from './grades.service.js';
import { CreateGradeDto, GradeResponseDto, GradeVersionResponseDto } from './dto/grade.dto.js';
export declare class NotenController {
    private readonly service;
    constructor(service: NotenService);
    create(user: CurrentUser, dto: CreateGradeDto): Promise<GradeResponseDto>;
    findAll(user: CurrentUser): Promise<GradeResponseDto[]>;
    warnliste(user: CurrentUser): Promise<{
        kritisch: {
            warnstufe: string;
            id: string;
            azubiId: string;
            createdAt: Date;
            updatedAt: Date;
            typ: import("@prisma/client").$Enums.GradeTyp;
            status: import("@prisma/client").$Enums.GradeStatus;
            beschreibung: string | null;
            fach: string;
            note: number;
            zeitraum: string;
            halbjahr: import("@prisma/client").$Enums.Halbjahr | null;
            datum: Date | null;
            pruefungsart: import("@prisma/client").$Enums.Pruefungsart | null;
            gewichtung: number | null;
            gewichtungsKategorie: import("@prisma/client").$Enums.Gewichtungskategorie | null;
            bemerkungen: string | null;
            prueferId: string | null;
            pruefungsdatum: Date | null;
            wiederholung: boolean;
            maßnahme: string | null;
            zeugnisUrl: string | null;
            quellenUrl: string | null;
            kursId: string | null;
            bewertetVon: string | null;
            bewertetAm: Date | null;
            bewertung: string | null;
        }[];
        warnung: {
            warnstufe: string;
            id: string;
            azubiId: string;
            createdAt: Date;
            updatedAt: Date;
            typ: import("@prisma/client").$Enums.GradeTyp;
            status: import("@prisma/client").$Enums.GradeStatus;
            beschreibung: string | null;
            fach: string;
            note: number;
            zeitraum: string;
            halbjahr: import("@prisma/client").$Enums.Halbjahr | null;
            datum: Date | null;
            pruefungsart: import("@prisma/client").$Enums.Pruefungsart | null;
            gewichtung: number | null;
            gewichtungsKategorie: import("@prisma/client").$Enums.Gewichtungskategorie | null;
            bemerkungen: string | null;
            prueferId: string | null;
            pruefungsdatum: Date | null;
            wiederholung: boolean;
            maßnahme: string | null;
            zeugnisUrl: string | null;
            quellenUrl: string | null;
            kursId: string | null;
            bewertetVon: string | null;
            bewertetAm: Date | null;
            bewertung: string | null;
        }[];
        gut: {
            warnstufe: string;
            id: string;
            azubiId: string;
            createdAt: Date;
            updatedAt: Date;
            typ: import("@prisma/client").$Enums.GradeTyp;
            status: import("@prisma/client").$Enums.GradeStatus;
            beschreibung: string | null;
            fach: string;
            note: number;
            zeitraum: string;
            halbjahr: import("@prisma/client").$Enums.Halbjahr | null;
            datum: Date | null;
            pruefungsart: import("@prisma/client").$Enums.Pruefungsart | null;
            gewichtung: number | null;
            gewichtungsKategorie: import("@prisma/client").$Enums.Gewichtungskategorie | null;
            bemerkungen: string | null;
            prueferId: string | null;
            pruefungsdatum: Date | null;
            wiederholung: boolean;
            maßnahme: string | null;
            zeugnisUrl: string | null;
            quellenUrl: string | null;
            kursId: string | null;
            bewertetVon: string | null;
            bewertetAm: Date | null;
            bewertung: string | null;
        }[];
        gesamt: number;
    }>;
    findOne(id: string, user: CurrentUser): Promise<GradeResponseDto>;
    confirm(id: string, user: CurrentUser): Promise<GradeResponseDto>;
    visieren(id: string, user: CurrentUser): Promise<GradeResponseDto>;
    archivieren(id: string, user: CurrentUser): Promise<GradeResponseDto>;
    bewerten(id: string, user: CurrentUser, dto: {
        bewertung: string;
        pruefungsdatum?: Date;
    }): Promise<GradeResponseDto>;
    zeugnisUpload(id: string, user: CurrentUser, dto: {
        zeugnisUrl: string;
    }): Promise<GradeResponseDto>;
    wiederholung(id: string, user: CurrentUser, dto: {
        maßnahme?: string;
    }): Promise<GradeResponseDto>;
    addMaßnahme(id: string, user: CurrentUser, dto: {
        maßnahme: string;
    }): Promise<GradeResponseDto>;
    getVersions(id: string, user: CurrentUser): Promise<GradeVersionResponseDto[]>;
    getDiff(id: string, v1: number, v2: number, user: CurrentUser): Promise<{
        v1: string;
        v2: string;
    }>;
    getGPA(id: string, user: CurrentUser): Promise<{
        gesamt: number;
        erstesHalbjahr: number | null;
        zweitesHalbjahr: number | null;
        anzahlNoten: number;
    }>;
    dashboard(user: CurrentUser, query?: {
        fach?: string;
        halbjahr?: string;
        zeitraum?: string;
    }): Promise<{
        zusammenfassung: {
            insgesamt: number;
            nachStatus: Record<string, number>;
            nachFach: Record<string, number>;
        };
        noten: {
            id: string;
            azubiId: string;
            createdAt: Date;
            updatedAt: Date;
            typ: import("@prisma/client").$Enums.GradeTyp;
            status: import("@prisma/client").$Enums.GradeStatus;
            beschreibung: string | null;
            fach: string;
            note: number;
            zeitraum: string;
            halbjahr: import("@prisma/client").$Enums.Halbjahr | null;
            datum: Date | null;
            pruefungsart: import("@prisma/client").$Enums.Pruefungsart | null;
            gewichtung: number | null;
            gewichtungsKategorie: import("@prisma/client").$Enums.Gewichtungskategorie | null;
            bemerkungen: string | null;
            prueferId: string | null;
            pruefungsdatum: Date | null;
            wiederholung: boolean;
            maßnahme: string | null;
            zeugnisUrl: string | null;
            quellenUrl: string | null;
            kursId: string | null;
            bewertetVon: string | null;
            bewertetAm: Date | null;
            bewertung: string | null;
        }[];
    }>;
    remove(id: string, user: CurrentUser): Promise<void>;
    exportCsv(user: CurrentUser, query?: {
        azubiId?: string;
    }): Promise<string>;
    exportPdf(id: string, user: CurrentUser, res: any): Promise<void>;
    exportDsgvo(id: string, user: CurrentUser): Promise<string>;
    anonymizeDsgvo(id: string, user: CurrentUser): Promise<void>;
    deleteDsgvo(azubiId: string, user: CurrentUser): Promise<void>;
}
