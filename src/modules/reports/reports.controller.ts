import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ReportStatus, ReportTyp } from '@prisma/client';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { BerichteService } from './reports.service.js';
import {
  AddAttachmentDto,
  AddCommentDto,
  AddTimeEntryDto,
  BatchReviewDto,
  CreateReportDto,
  ReportResponseDto,
  ReviewReportDto,
  UpdateReportDto,
} from './dto/report.dto.js';

@ApiTags('berichte')
@ApiBearerAuth()
@Controller({ path: 'berichte', version: '1' })
export class BerichteController {
  constructor(private readonly service: BerichteService) {}

  @ApiOperation({ summary: 'Erstellt einen Bericht (Azubi, Status entwurf)' })
  @ApiResponse({ status: 201, type: ReportResponseDto })
  @Roles(Role.azubi)
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Berichte (rollen-/scope-berechtigt)' })
  @ApiResponse({ status: 200 })
  @Get()
  findAll(
    @CurrentUser() user: CurrentUser,
    @Query() query: PaginationQueryDto,
    @Query('azubiId') azubiId?: string,
    @Query('status') status?: ReportStatus,
    @Query('jahr') jahr?: string,
    @Query('typ') typ?: ReportTyp,
  ) {
    // Convert query parameters to proper types
    const filter = {
      azubiId,
      status: status ? (status as ReportStatus) : undefined,
      jahr: jahr ? Number(jahr) : undefined,
      typ: typ ? (typ as ReportTyp) : undefined,
    };
    return this.service.findAll(user, query, filter);
  }

  @ApiOperation({ summary: 'Liefert einen Bericht' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ReportResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Bearbeitet einen Bericht (Azubi, nur entwurf)' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @Roles(Role.azubi)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateReportDto,
  ): Promise<ReportResponseDto> {
    return this.service.update(id, user, dto);
  }

  @ApiOperation({ summary: 'Löscht einen Bericht (Azubi, nur entwurf)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.azubi)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }

  @ApiOperation({ summary: 'Reicht einen Bericht ein' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @Roles(Role.azubi)
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ReportResponseDto> {
    return this.service.submit(id, user);
  }

  @ApiOperation({ summary: 'Vorprüfung durch Ausbildungsbeauftragten' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @Roles(Role.ausbildungsbeauftragter)
  @Post(':id/review')
  review(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: ReviewReportDto,
  ): Promise<ReportResponseDto> {
    return this.service.review(id, user, dto);
  }

  @ApiOperation({ summary: 'Finale Visierung durch Ausbilder' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @Roles(Role.ausbilder)
  @Post(':id/visieren')
  visieren(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ReportResponseDto> {
    return this.service.visieren(id, user);
  }

  @ApiOperation({ summary: 'Archiviert einen visierten Bericht' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @Roles(Role.ausbilder)
  @Post(':id/archivieren')
  archivieren(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ReportResponseDto> {
    return this.service.archivieren(id, user);
  }

  @ApiOperation({ summary: 'Einreichung zurückziehen (eingereicht → entwurf)' })
  @ApiResponse({ status: 200, type: ReportResponseDto })
  @ApiResponse({ status: 403, description: 'Nicht der Owner oder falscher Status' })
  @Roles(Role.azubi)
  @Post(':id/cancel')
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ReportResponseDto> {
    return this.service.cancel(id, user);
  }

  @ApiOperation({ summary: 'Fügt einen Kommentar hinzu' })
  @ApiResponse({ status: 201, description: 'Erstellt' })
  @Roles(Role.ausbildungsbeauftragter, Role.ausbilder)
  @Post(':id/kommentare')
  addComment(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: AddCommentDto,
  ): Promise<void> {
    return this.service.addComment(id, user, dto);
  }

  @ApiOperation({ summary: 'Listet Kommentare eines Berichts' })
  @ApiResponse({ status: 200 })
  @Get(':id/kommentare')
  getComments(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getComments(id, user);
  }

  @ApiOperation({ summary: 'Anhang hinzufügen (Screenshot/Diagramm/Code)' })
  @ApiBody({ type: AddAttachmentDto })
  @ApiResponse({ status: 201, description: 'Anhang erstellt' })
  @ApiResponse({ status: 403, description: 'Keine Berechtigung' })
  @Post(':id/attachments')
  addAttachment(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: AddAttachmentDto,
  ): Promise<void> {
    return this.service.addAttachment(id, user, dto);
  }

  @ApiOperation({ summary: 'Listet Anhänge eines Berichts' })
  @ApiResponse({ status: 200, description: 'Liste der Anhänge' })
  @Get(':id/attachments')
  getAttachments(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getAttachments(id, user);
  }

  @ApiOperation({ summary: 'Zeiterfassung je Tätigkeit' })
  @ApiBody({ type: AddTimeEntryDto })
  @ApiResponse({ status: 201, description: 'Zeiteintrag erstellt' })
  @ApiResponse({ status: 403, description: 'Keine Berechtigung' })
  @Post(':id/time-entries')
  addTimeEntry(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: AddTimeEntryDto,
  ): Promise<void> {
    return this.service.addTimeEntry(id, user, dto);
  }

  @ApiOperation({ summary: 'Listet Zeiteinträge eines Berichts' })
  @ApiResponse({ status: 200, description: 'Liste der Zeiteinträge' })
  @Get(':id/time-entries')
  getTimeEntries(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getTimeEntries(id, user);
  }

  @ApiOperation({ summary: 'Versionshistorie eines Berichts' })
  @ApiResponse({ status: 200, description: 'Versionen chronologisch' })
  @Get(':id/versions')
  getVersions(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getVersions(id, user);
  }

  @ApiOperation({ summary: 'Diff zweier Versionen' })
  @ApiResponse({ status: 200, description: 'Inhalte beider Versionen' })
  @Get(':id/versions/:v1/diff/:v2')
  getDiff(
    @Param('id') id: string,
    @Param('v1') v1: string,
    @Param('v2') v2: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getDiff(id, user, Number(v1), Number(v2));
  }

  @ApiOperation({ summary: 'Batch-Review mehrerer Berichte' })
  @ApiBody({ type: BatchReviewDto })
  @ApiResponse({ status: 200, description: 'Batch-Ergebnis mit Erfolgs/Fehler-Statistik' })
  @ApiResponse({ status: 400, description: 'Max. 100 Berichte pro Batch' })
  @Roles(Role.ausbildungsbeauftragter, Role.ausbilder)
  @Post('batch-review')
  batchReview(
    @CurrentUser() user: CurrentUser,
    @Body() dto: BatchReviewDto,
  ) {
    return this.service.batchReview(user, dto);
  }

  @ApiOperation({ summary: 'Review Queue — eingereichte Berichte zur Prüfung' })
  @ApiResponse({ status: 200, description: 'Eingereichte Berichte mit Azubi-Info' })
  @Roles(Role.ausbildungsbeauftragter, Role.ausbilder)
  @Get('review-queue')
  getReviewQueue(
    @CurrentUser() user: CurrentUser,
    @Query() query: PaginationQueryDto,
    @Query('azubiId') azubiId?: string,
    @Query('jahr') jahr?: string,
    @Query('kalenderwoche') kalenderwoche?: string,
  ) {
    return this.service.getReviewQueue(user, query, {
      azubiId,
      jahr: jahr ? Number(jahr) : undefined,
      kalenderwoche: kalenderwoche ? Number(kalenderwoche) : undefined,
    });
  }

  @ApiOperation({ summary: 'Exportiert Berichte als CSV' })
  @ApiResponse({ status: 200, description: 'CSV-Datei' })
  @Roles(Role.ausbildungsbeauftragter, Role.ausbilder)
  @Get('export/review-csv')
  @RawResponse()
  async exportReviewCsv(
    @CurrentUser() user: CurrentUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const csv = await this.service.exportReviewCsv(user);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="berichte-review.csv"',
    );
    res.send(csv);
  }

  @ApiOperation({ summary: 'Exportiert einen Bericht als IHK-PDF' })
  @ApiResponse({ status: 200, description: 'PDF-Binary' })
  @Get(':id/export.pdf')
  @RawResponse()
  async exportPdf(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const buffer = await this.service.exportPdf(id, user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="bericht-${id}.pdf"`,
    );
    res.send(buffer);
  }
}
