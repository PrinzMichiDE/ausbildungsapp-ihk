import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { EinsatzplanungService } from './einsatzplanung.service.js';
import { CreateEinsatzPlanungDto, UpdateEinsatzPlanungDto, EinsatzPlanungQueryDto, EinsatzUserAssignmentDto } from './dto/einsatzplanung.dto.js';
export declare class EinsatzplanungController {
    private readonly einsatzplanungService;
    constructor(einsatzplanungService: EinsatzplanungService);
    findAll(query: EinsatzPlanungQueryDto, currentUser: CurrentUser): Promise<{
        data: ({
            abteilung: {
                id: string;
                kurzzeichen: string | null;
                bezeichnung: never;
            };
            azubi: {
                id: string;
                email: string;
                vorname: never;
                nachname: never;
            };
        } & {
            id: string;
            azubiId: string;
            abteilungId: string;
            von: Date;
            bis: Date;
            skillLevel: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string, user: CurrentUser): Promise<{
        abteilung: {
            id: string;
            kurzzeichen: string | null;
            bezeichnung: never;
        };
        azubi: {
            id: string;
            email: string;
            vorname: never;
            nachname: never;
        };
    } & {
        id: string;
        azubiId: string;
        abteilungId: string;
        von: Date;
        bis: Date;
        skillLevel: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateEinsatzPlanungDto, user: any): Promise<{
        abteilung: {
            id: string;
            kurzzeichen: string | null;
            bezeichnung: never;
        };
        azubi: {
            id: string;
            email: string;
            vorname: never;
            nachname: never;
        };
    } & {
        id: string;
        azubiId: string;
        abteilungId: string;
        von: Date;
        bis: Date;
        skillLevel: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateEinsatzPlanungDto, user: any): Promise<{
        abteilung: {
            id: string;
            kurzzeichen: string | null;
            bezeichnung: never;
        };
        azubi: {
            id: string;
            email: string;
            vorname: never;
            nachname: never;
        };
    } & {
        id: string;
        azubiId: string;
        abteilungId: string;
        von: Date;
        bis: Date;
        skillLevel: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, user: any): Promise<{
        deleted: string;
    }>;
    getCalendarView(query: EinsatzPlanungQueryDto, currentUser: CurrentUser): Promise<{
        data: ({
            abteilung: {
                id: string;
                kurzzeichen: string | null;
                bezeichnung: never;
            };
            azubi: {
                id: string;
                vorname: never;
                nachname: never;
            };
        } & {
            id: string;
            azubiId: string;
            abteilungId: string;
            von: Date;
            bis: Date;
            skillLevel: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
    }>;
    assignUser(id: string, dto: EinsatzUserAssignmentDto, user: any): Promise<{
        abteilung: {
            id: string;
            kurzzeichen: string | null;
            bezeichnung: never;
        };
        azubi: {
            id: string;
            email: string;
            vorname: never;
            nachname: never;
        };
    } & {
        id: string;
        azubiId: string;
        abteilungId: string;
        von: Date;
        bis: Date;
        skillLevel: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
