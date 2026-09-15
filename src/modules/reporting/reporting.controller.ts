import {
  Controller,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ReportingService } from './reporting.service.js';
import {
  AbteilungsZufriedenheitDto,
  DashboardResult,
  ExportKindDto,
  ExportQueryDto,
  ReportQuoteDto,
  SkillCoverageDto,
} from './dto/reporting.dto.js';

@ApiTags('reporting')
@ApiBearerAuth()
@Controller({ path: 'reporting', version: '1' })
export class ReportingController {
  constructor(private readonly service: ReportingService) {}

  @ApiOperation({ summary: 'Rollenspezifisches Dashboard' })
  @ApiResponse({ status: 200, type: Object })
  @Get('dashboard')
  getDashboard(@CurrentUser() user: CurrentUser): Promise<DashboardResult> {
    return this.service.getDashboard(user);
  }

  @ApiOperation({ summary: 'Berichtsheft-Quote je Azubi (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 200, type: [ReportQuoteDto] })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Get('kpis/report-quote')
  reportQuote(
    @CurrentUser() user: CurrentUser,
    @Query('jahr') jahr?: string,
  ): Promise<ReportQuoteDto[]> {
    return this.service.reportQuote(user, jahr ? Number(jahr) : undefined);
  }

  @ApiOperation({ summary: 'Kompetenzabdeckung je Kurs' })
  @ApiResponse({ status: 200, type: [SkillCoverageDto] })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Get('kpis/skill-coverage')
  skillCoverage(
    @CurrentUser() user: CurrentUser,
  ): Promise<SkillCoverageDto[]> {
    return this.service.skillCoverage(user);
  }

  @ApiOperation({ summary: 'Abteilungsdurchlauf-Zufriedenheit' })
  @ApiResponse({ status: 200, type: [AbteilungsZufriedenheitDto] })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Get('kpis/abteilungs-zufriedenheit')
  abteilungsZufriedenheit(
    @CurrentUser() user: CurrentUser,
  ): Promise<AbteilungsZufriedenheitDto[]> {
    return this.service.abteilungsZufriedenheit(user);
  }

  @ApiOperation({ summary: 'CSV-Export von Kennzahlen (attendance|grades|competency)' })
  @RawResponse()
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Get('export/:kind')
  async exportCsv(
    @Param() params: ExportKindDto,
    @Query() query: ExportQueryDto,
    @CurrentUser() user: CurrentUser,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.service.exportCsv(user, params, query);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.filename}"`,
    );
    res.send(result.csv);
  }
}