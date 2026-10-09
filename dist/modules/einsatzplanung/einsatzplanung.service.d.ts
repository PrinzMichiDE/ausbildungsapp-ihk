import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { CreateEinsatzPlanungDto, UpdateEinsatzPlanungDto, EinsatzPlanungQueryDto, EinsatzUserAssignmentDto } from './dto/einsatzplanung.dto.js';
export declare class EinsatzplanungService {
    private readonly prisma;
    private readonly accessScope;
    private readonly logger;
    constructor(prisma: PrismaService, accessScope: AccessScopeService);
    findAll(dto: EinsatzPlanungQueryDto, currentUser: CurrentUser): Promise<{
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
    findById(id: string, currentUser: CurrentUser): Promise<{
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
    create(dto: CreateEinsatzPlanungDto, currentUser: CurrentUser): Promise<{
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
    update(id: string, dto: UpdateEinsatzPlanungDto, currentUser: CurrentUser): Promise<{
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
    remove(id: string, currentUser: CurrentUser): Promise<{
        deleted: string;
    }>;
    getCalendarView(dto: EinsatzPlanungQueryDto, currentUser: CurrentUser): Promise<{
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
    assignUser(id: string, dto: EinsatzUserAssignmentDto, currentUser: CurrentUser): Promise<{
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
    getUserAssignments(einsatzId: string, currentUser: CurrentUser): Promise<{
        data: {
            azubiId: string;
            azubi: {
                id: string;
                azubiId: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                firstName: string;
                lastName: string;
                isActive: boolean;
                mfaActive: boolean;
                passwordHash: string;
                mfaSecret: string | null;
            };
            abteilungId: string;
            von: Date;
            bis: Date;
        };
    }>;
}
