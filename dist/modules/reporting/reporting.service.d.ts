import { PrismaService } from '../../database/prisma.service.js';
import { AccessScopeService } from '../../common/rbac/access-scope.service.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AbteilungsZufriedenheitDto, DashboardResult, ExportKindDto, ExportQueryDto, ReportQuoteDto, SkillCoverageDto } from './dto/reporting.dto.js';
export declare class ReportingService {
    private readonly prisma;
    private readonly scope;
    constructor(prisma: PrismaService, scope: AccessScopeService);
    getDashboard(currentUser: CurrentUser): Promise<DashboardResult>;
    reportQuote(currentUser: CurrentUser, year?: number): Promise<ReportQuoteDto[]>;
    skillCoverage(currentUser: CurrentUser): Promise<SkillCoverageDto[]>;
    abteilungsZufriedenheit(currentUser: CurrentUser): Promise<AbteilungsZufriedenheitDto[]>;
    exportCsv(currentUser: CurrentUser, dto: ExportKindDto, query: ExportQueryDto): Promise<{
        filename: string;
        csv: string;
    }>;
    private azubiDashboard;
    private ausbildungsbeauftragterDashboard;
    private ausbilderHrDashboard;
    private collectWarnings;
    private scopedAzubiWhere;
}
