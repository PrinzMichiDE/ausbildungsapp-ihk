import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
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
import { DatenschutzService } from './data-privacy.service.js';
import {
  ConsentGrantDto,
  ConsentLogResponseDto,
  ConsentResponseDto,
  ConsentRevokeDto,
  CreateDatenschutzRequestDto,
  DatenschutzRequestResponseDto,
  DpiaDto,
  DpiaResponseDto,
  LegalBasisDto,
  LegalBasisResponseDto,
  PersonalDataExport,
  ProcessDatenschutzRequestDto,
  UpdateDpiaDto,
  UpdateLegalBasisDto,
} from './dto/data-privacy.dto.js';

@ApiTags('datenschutz')
@ApiBearerAuth()
@Controller({ path: 'datenschutz', version: '1' })
export class DatenschutzController {
  constructor(private readonly service: DatenschutzService) {}

  // ---- Betroffenenrechte: Anträge ----

  @ApiOperation({ summary: 'Legt einen DSGVO-Antrag (Auskunft/Export/Löschung/...) an' })
  @ApiResponse({ status: 201, type: DatenschutzRequestResponseDto })
  @Post('requests')
  createRequest(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateDatenschutzRequestDto,
  ): Promise<DatenschutzRequestResponseDto> {
    return this.service.createRequest(user, dto);
  }

  @ApiOperation({ summary: 'Listet DSGVO-Anträge (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [DatenschutzRequestResponseDto] })
  @Get('requests')
  findAllRequests(
    @CurrentUser() user: CurrentUser,
  ): Promise<DatenschutzRequestResponseDto[]> {
    return this.service.findAllRequests(user);
  }

  @ApiOperation({ summary: 'Liefert einen DSGVO-Antrag' })
  @ApiResponse({ status: 200, type: DatenschutzRequestResponseDto })
  @Get('requests/:id')
  findRequest(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<DatenschutzRequestResponseDto> {
    return this.service.findRequest(id, user);
  }

  @ApiOperation({ summary: 'Bearbeitet einen DSGVO-Antrag (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 200, type: DatenschutzRequestResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Patch('requests/:id')
  processRequest(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: ProcessDatenschutzRequestDto,
  ): Promise<DatenschutzRequestResponseDto> {
    return this.service.processRequest(id, user, dto);
  }

  @ApiOperation({ summary: 'Exportiert die personenbezogenen Daten (Art. 15/20) als JSON' })
  @ApiResponse({ status: 200, type: Object })
  @RawResponse()
  @Get('requests/:id/export')
  async exportPersonalData(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Res() res: Response,
  ): Promise<void> {
    const data: PersonalDataExport = await this.service.exportPersonalData(id, user);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="datenschutz-export-${id}.json"`,
    );
    res.send(data);
  }

  @ApiOperation({ summary: 'Anonymisiert einen Azubi (Recht auf Vergessenwerden)' })
  @ApiResponse({ status: 200 })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Delete('anonymize/:azubiId')
  anonymize(
    @Param('azubiId') azubiId: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.anonymize(azubiId, user);
  }

  // ---- Einwilligungen (Art. 7) ----

  @ApiOperation({ summary: 'Listet eigene Einwilligungen' })
  @ApiResponse({ status: 200, type: [ConsentResponseDto] })
  @Get('consents')
  findConsents(
    @CurrentUser() user: CurrentUser,
  ): Promise<ConsentResponseDto[]> {
    return this.service.findConsents(user);
  }

  @ApiOperation({ summary: 'Erteilt eine Einwilligung' })
  @ApiResponse({ status: 201, type: ConsentResponseDto })
  @Post('consents')
  grantConsent(
    @CurrentUser() user: CurrentUser,
    @Body() dto: ConsentGrantDto,
    @Ip() ip?: string,
  ): Promise<ConsentResponseDto> {
    return this.service.grantConsent(user, dto, ip);
  }

  @ApiOperation({ summary: 'Widerruft eine Einwilligung' })
  @ApiResponse({ status: 200, type: ConsentResponseDto })
  @Post('consents/:key/revoke')
  revokeConsent(
    @Param('key') key: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: ConsentRevokeDto,
    @Ip() ip?: string,
  ): Promise<ConsentResponseDto> {
    return this.service.revokeConsent(user, key, dto.version, ip);
  }

  @ApiOperation({ summary: 'Liefert das Einwilligungs-Log (Nachweis)' })
  @ApiResponse({ status: 200, type: [ConsentLogResponseDto] })
  @Get('consents/log')
  findConsentLog(
    @CurrentUser() user: CurrentUser,
  ): Promise<ConsentLogResponseDto[]> {
    return this.service.findConsentLog(user);
  }

  // ---- Verarbeitungsverzeichnis (Art. 30) ----

  @ApiOperation({ summary: 'Listet Verarbeitungen (Art. 30)' })
  @ApiResponse({ status: 200, type: [LegalBasisResponseDto] })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Get('legal-bases')
  findAllLegalBases(): Promise<LegalBasisResponseDto[]> {
    return this.service.findAllLegalBases();
  }

  @ApiOperation({ summary: 'Legt eine Verarbeitung an (Admin/HR)' })
  @ApiResponse({ status: 201, type: LegalBasisResponseDto })
  @Roles(Role.admin, Role.hr)
  @Post('legal-bases')
  createLegalBasis(@Body() dto: LegalBasisDto): Promise<LegalBasisResponseDto> {
    return this.service.createLegalBasis(dto);
  }

  @ApiOperation({ summary: 'Aktualisiert eine Verarbeitung (Admin/HR)' })
  @ApiResponse({ status: 200, type: LegalBasisResponseDto })
  @Roles(Role.admin, Role.hr)
  @Patch('legal-bases/:id')
  updateLegalBasis(
    @Param('id') id: string,
    @Body() dto: UpdateLegalBasisDto,
  ): Promise<LegalBasisResponseDto> {
    return this.service.updateLegalBasis(id, dto);
  }

  @ApiOperation({ summary: 'Löscht eine Verarbeitung (Admin)' })
  @ApiResponse({ status: 204 })
  @Roles(Role.admin)
  @Delete('legal-bases/:id')
  async removeLegalBasis(@Param('id') id: string): Promise<void> {
    await this.service.removeLegalBasis(id);
  }

  // ---- DPIA (Art. 35) ----

  @ApiOperation({ summary: 'Listet DPIA-Einträge (Art. 35)' })
  @ApiResponse({ status: 200, type: [DpiaResponseDto] })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Get('dpia')
  findAllDpia(): Promise<DpiaResponseDto[]> {
    return this.service.findAllDpia();
  }

  @ApiOperation({ summary: 'Legt einen DPIA-Eintrag an (Admin/HR)' })
  @ApiResponse({ status: 201, type: DpiaResponseDto })
  @Roles(Role.admin, Role.hr)
  @Post('dpia')
  createDpia(
    @CurrentUser() user: CurrentUser,
    @Body() dto: DpiaDto,
  ): Promise<DpiaResponseDto> {
    return this.service.createDpia(user, dto);
  }

  @ApiOperation({ summary: 'Aktualisiert einen DPIA-Eintrag (Admin/HR)' })
  @ApiResponse({ status: 200, type: DpiaResponseDto })
  @Roles(Role.admin, Role.hr)
  @Patch('dpia/:id')
  updateDpia(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateDpiaDto,
  ): Promise<DpiaResponseDto> {
    return this.service.updateDpia(id, user, dto);
  }

  @ApiOperation({ summary: 'Löscht einen DPIA-Eintrag (Admin)' })
  @ApiResponse({ status: 204 })
  @Roles(Role.admin)
  @Delete('dpia/:id')
  async removeDpia(@Param('id') id: string): Promise<void> {
    await this.service.removeDpia(id);
  }
}