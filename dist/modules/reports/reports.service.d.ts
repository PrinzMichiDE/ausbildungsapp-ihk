import { ReportStatus, ReportTyp } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AuditService } from '../audit/audit.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { AddCommentDto, CreateReportDto, ReportResponseDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto.js';
export declare class BerichteService {
    private readonly prisma;
    private readonly scope;
    private readonly notifications;
    private readonly audit;
    constructor(prisma: PrismaService, scope: AccessScopeService, notifications: NotificationsService, audit: AuditService);
    create(currentUser: CurrentUser, dto: CreateReportDto): Promise<ReportResponseDto>;
    findAll(currentUser: CurrentUser, query: PaginationQueryDto, filter: {
        azubiId?: string;
        status?: ReportStatus;
        jahr?: number;
        typ?: ReportTyp;
    }): Promise<{
        items: readonly ReportResponseDto[];
        meta: import("../../common/dto/pagination-query.dto.js").PaginationMeta;
    }>;
    findOne(id: string, currentUser: CurrentUser): Promise<ReportResponseDto>;
    update(id: string, currentUser: CurrentUser, dto: UpdateReportDto): Promise<ReportResponseDto>;
    remove(id: string, currentUser: CurrentUser): Promise<void>;
    submit(id: string, currentUser: CurrentUser): Promise<ReportResponseDto>;
    addAttachment(id: string, user: CurrentUser, dto: {
        typ: string;
        dateiUrl: string;
        kommentar?: string;
    }): Promise<void>;
    getAttachments(id: string, user: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        typ: string;
        kommentar: string | null;
        dateiUrl: string;
        reportId: string;
        erstelltVon: string | null;
    }[]>;
    addTimeEntry(id: string, user: CurrentUser, dto: {
        taskId?: string;
        stunden: number;
        kommentar?: string;
    }): Promise<void>;
    getTimeEntries(id: string, user: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        kommentar: string | null;
        taskId: string | null;
        stunden: number;
        reportId: string;
    }[]>;
    getVersions(id: string, user: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        inhaltMarkdown: string;
        version: number;
        reportId: string;
        erstelltVon: string | null;
    }[]>;
    getDiff(id: string, user: CurrentUser, v1: number, v2: number): Promise<{
        v1: string;
        v2: string;
    }>;
    review(id: string, currentUser: CurrentUser, dto: ReviewReportDto): Promise<ReportResponseDto>;
    visieren(id: string, currentUser: CurrentUser): Promise<ReportResponseDto>;
    archivieren(id: string, currentUser: CurrentUser): Promise<ReportResponseDto>;
    cancel(id: string, currentUser: CurrentUser): Promise<ReportResponseDto>;
    addComment(id: string, currentUser: CurrentUser, dto: AddCommentDto): Promise<void>;
    getComments(id: string, currentUser: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        art: string;
        reportId: string;
        authorId: string;
    }[]>;
    exportPdf(id: string, currentUser: CurrentUser): Promise<Buffer>;
    private loadOwned;
    private load;
    private notifyReviewers;
    private assertTasksReleased;
    private addCommentInternal;
    getReviewQueue(currentUser: CurrentUser, query: PaginationQueryDto, filter: {
        azubiId?: string;
        jahr?: number;
        kalenderwoche?: number;
    }): Promise<{
        items: readonly {
            azubiName: string;
            id: string;
            azubiId: string;
            titel: string;
            typ: ReportTyp;
            kalenderwoche: number;
            jahr: number;
            datumVon: Date;
            datumBis: Date;
            inhaltMarkdown: string;
            status: ReportStatus;
            signiertVon: string | null;
            signiertAm: Date | null;
            archiviertAm: Date | null;
            taskIds: string[];
            createdAt: Date;
        }[];
        meta: import("../../common/dto/pagination-query.dto.js").PaginationMeta;
    }>;
    batchReview(currentUser: CurrentUser, dto: {
        reportIds: string[];
        entscheidung: 'freigeben' | 'zurueck';
        kommentar?: string;
    }): Promise<{
        total: number;
        successCount: number;
        errorCount: number;
        results: {
            reportId: string;
            success: boolean;
            error?: string;
        }[];
    }>;
    exportReviewCsv(currentUser: CurrentUser): Promise<string>;
    private toResponse;
}
