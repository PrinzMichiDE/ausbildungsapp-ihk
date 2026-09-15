import type { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { ReportingService } from './reporting.service.js';
import { AbteilungsZufriedenheitDto, DashboardResult, ExportKindDto, ExportQueryDto, ReportQuoteDto, SkillCoverageDto } from './dto/reporting.dto.js';
export declare class ReportingController {
    private readonly service;
    constructor(service: ReportingService);
    getDashboard(user: CurrentUser): Promise<DashboardResult>;
    reportQuote(user: CurrentUser, jahr?: string): Promise<ReportQuoteDto[]>;
    skillCoverage(user: CurrentUser): Promise<SkillCoverageDto[]>;
    abteilungsZufriedenheit(user: CurrentUser): Promise<AbteilungsZufriedenheitDto[]>;
    exportCsv(params: ExportKindDto, query: ExportQueryDto, user: CurrentUser, res: Response): Promise<void>;
}
