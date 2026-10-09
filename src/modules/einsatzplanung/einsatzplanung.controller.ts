import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { EinsatzplanungService } from './einsatzplanung.service.js';
import {
  CreateEinsatzPlanungDto,
  UpdateEinsatzPlanungDto,
  EinsatzPlanungQueryDto,
  EinsatzPlanungResponseDto,
  EinsatzUserAssignmentDto,
} from './dto/einsatzplanung.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

/**
 * Einsatzplanung Controller — CRUD REST-API für den Einsatzplanungs-Modul.
 *
 * Alle Endpoints sind per API-Versionierung `/api/v1/` geschützt.
 * Schreiboperationen erfordern eine der write-Rollen (ausbildungsbeauftragter, hr, admin).
 */
@ApiTags('Einsatzplanung')
@ApiBearerAuth()
@Controller({ path: 'einsatzplanung', version: '1' })
export class EinsatzplanungController {
  constructor(private readonly einsatzplanungService: EinsatzplanungService) {}

  // ------------------------------------------------------------------
  // List — GET /api/v1/einsatzplanung
  // ------------------------------------------------------------------

  @Get()
  @Roles('azubi', 'ausbildungsbeauftragter', 'ausbilder', 'hr', 'admin')
  @ApiOperation({ summary: 'Liste alle Einsatzplanungseinträge mit Filtern' })
  @ApiResponse({
    status: 200,
    description: 'Paginierte Liste der Einsatzplanungseinträge',
    type: [EinsatzPlanungResponseDto],
  })
  async findAll(@Query() query: EinsatzPlanungQueryDto, @CurrentUser() currentUser: CurrentUser) {
    return this.einsatzplanungService.findAll(query, currentUser);
  }

  // ------------------------------------------------------------------
  // Get by ID — GET /api/v1/einsatzplanung/:id
  // ------------------------------------------------------------------

  @Get(':id')
  @Roles('azubi', 'ausbildungsbeauftragter', 'ausbilder', 'hr', 'admin')
  @ApiOperation({ summary: 'Lies einen Einsatzplanungseintrag nach ID' })
  @ApiResponse({
    status: 200,
    description: 'Einsatzplanungseintrag',
    type: EinsatzPlanungResponseDto,
  })
  async findById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.einsatzplanungService.findById(id, user.id);
  }

  // ------------------------------------------------------------------
  // Create — POST /api/v1/einsatzplanung
  // ------------------------------------------------------------------

  @Post()
  @Roles('ausbildungsbeauftragter', 'hr', 'admin')
  @ApiOperation({ summary: 'Erstellt einen neuen Einsatzplanungseintrag' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Neuer Einsatzplanungseintrag wurde erstellt',
    type: EinsatzPlanungResponseDto,
  })
  async create(@Body() dto: CreateEinsatzPlanungDto, @CurrentUser() user: any) {
    return this.einsatzplanungService.create(dto, user.id);
  }

  // ------------------------------------------------------------------
  // Update (PATCH) — PATCH /api/v1/einsatzplanung/:id
  // ------------------------------------------------------------------

  @Patch(':id')
  @Roles('ausbildungsbeauftragter', 'hr', 'admin')
  @ApiOperation({ summary: 'Aktualisiert einen Einsatzplanungseintrag (Partial)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Einsatzplanungseintrag wurde aktualisiert',
    type: EinsatzPlanungResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEinsatzPlanungDto,
    @CurrentUser() user: any,
  ) {
    return this.einsatzplanungService.update(id, dto, user.id);
  }

  // ------------------------------------------------------------------
  // Delete — DELETE /api/v1/einsatzplanung/:id
  // ------------------------------------------------------------------

  @Delete(':id')
  @Roles('ausbildungsbeauftragter', 'hr', 'admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Löscht einen Einsatzplanungseintrag' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Einsatzplanungseintrag wurde gelöscht',
  })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.einsatzplanungService.remove(id, user.id);
  }

  // ------------------------------------------------------------------
  // Calendar View — GET /api/v1/einsatzplanung/calendar
  // ------------------------------------------------------------------

  @Get('calendar')
  @Roles('azubi', 'ausbildungsbeauftragter', 'ausbilder', 'hr', 'admin')
  @ApiOperation({ summary: 'Kalenderansicht aller Einsätze in einem Zeitraum' })
  @ApiResponse({
    status: 200,
    description: 'Kalenderansicht der Einsätze',
    type: [EinsatzPlanungResponseDto],
  })
  async getCalendarView(@Query() query: EinsatzPlanungQueryDto) {
    return this.einsatzplanungService.getCalendarView(query);
  }

  // ------------------------------------------------------------------
  // User Assignment — POST /api/v1/einsatzplanung/:id/assign
  // ------------------------------------------------------------------

  @Post(':id/assign')
  @Roles('ausbildungsbeauftragter', 'hr', 'admin')
  @ApiOperation({ summary: 'Weist einen Azubi einem Einsatz zu' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Azubi wurde erfolgreich zugewiesen',
    type: EinsatzPlanungResponseDto,
  })
  async assignUser(
    @Param('id') id: string,
    @Body() dto: EinsatzUserAssignmentDto,
    @CurrentUser() user: any,
  ) {
    return this.einsatzplanungService.assignUser(id, dto, user.id);
  }
}