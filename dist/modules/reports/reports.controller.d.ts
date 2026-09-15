import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ReportStatus, ReportTyp } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { BerichteService } from './reports.service.js';
import { AddAttachmentDto, AddCommentDto, AddTimeEntryDto, BatchReviewDto, CreateReportDto, ReportResponseDto, ReviewReportDto, UpdateReportDto } from './dto/report.dto.js';
export declare class BerichteController {
    private readonly service;
    constructor(service: BerichteService);
    create(user: CurrentUser, dto: CreateReportDto): Promise<ReportResponseDto>;
    findAll(user: CurrentUser, query: PaginationQueryDto, azubiId?: string, status?: ReportStatus, jahr?: string, typ?: ReportTyp): Promise<{
        items: readonly ReportResponseDto[];
        meta: import("../../common/dto/pagination-query.dto.js").PaginationMeta;
    }>;
    findOne(id: string, user: CurrentUser): Promise<ReportResponseDto>;
    update(id: string, user: CurrentUser, dto: UpdateReportDto): Promise<ReportResponseDto>;
    remove(id: string, user: CurrentUser): Promise<void>;
    submit(id: string, user: CurrentUser): Promise<ReportResponseDto>;
    review(id: string, user: CurrentUser, dto: ReviewReportDto): Promise<ReportResponseDto>;
    visieren(id: string, user: CurrentUser): Promise<ReportResponseDto>;
    archivieren(id: string, user: CurrentUser): Promise<ReportResponseDto>;
    cancel(id: string, user: CurrentUser): Promise<ReportResponseDto>;
    addComment(id: string, user: CurrentUser, dto: AddCommentDto): Promise<void>;
    getComments(id: string, user: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        art: string;
        reportId: string;
        authorId: string;
    }[]>;
    addAttachment(id: string, user: CurrentUser, dto: AddAttachmentDto): Promise<void>;
    getAttachments(id: string, user: CurrentUser): Promise<{
        id: string;
        createdAt: Date;
        typ: string;
        kommentar: string | null;
        dateiUrl: string;
        reportId: string;
        erstelltVon: string | null;
    }[]>;
    addTimeEntry(id: string, user: CurrentUser, dto: AddTimeEntryDto): Promise<void>;
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
    getDiff(id: string, v1: string, v2: string, user: CurrentUser): Promise<{
        v1: string;
        v2: string;
    }>;
    batchReview(user: CurrentUser, dto: BatchReviewDto): Promise<{
        total: number;
        successCount: number;
        errorCount: number;
        results: {
            reportId: string;
            success: boolean;
            error?: string;
        }[];
    }>;
    getReviewQueue(user: CurrentUser, query: PaginationQueryDto, azubiId?: string, jahr?: string, kalenderwoche?: string): Promise<{
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
    exportReviewCsv(user: CurrentUser, res: Response): Promise<void>;
    exportPdf(id: string, user: CurrentUser, res: Response): Promise<void>;
}
