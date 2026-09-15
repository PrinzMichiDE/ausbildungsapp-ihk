import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { PruefungService } from './exams.service.js';
import {
  PruefungResponseDto,
  CreatePruefungDto,
  UpdatePruefungDto,
  PruefungsMeilensteinResponseDto,
  CreateMeilensteinDto,
  UpdateMeilensteinDto,
} from './dto/exams.dto.js';

@ApiTags('pruefungen')
@ApiBearerAuth()
@Controller({ path: 'pruefungen', version: '1' })
export class PruefungController {
  constructor(private readonly service: PruefungService) {}

  @ApiOperation({ summary: 'Erstellt eine neue Prüfung (Azubi)' })
  @ApiResponse({ status: 201, type: PruefungResponseDto })
  @Roles(Role.azubi, Role.ausbilder, Role.hr, Role.admin)
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreatePruefungDto,
  ): Promise<PruefungResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Prüfungen (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [PruefungResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<PruefungResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert eine Prüfung mit Meilensteinen' })
  @ApiResponse({ status: 200, type: PruefungResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<PruefungResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Aktualisiert eine Prüfung (nur angemeldet)' })
  @ApiResponse({ status: 200, type: PruefungResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePruefungDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<PruefungResponseDto> {
    return this.service.update(id, user, dto);
  }

  @ApiOperation({ summary: 'Ändert den Prüfungsstatus (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 200, type: PruefungResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Patch(':id/status/:status')
  statusChange(
    @Param('id') id: string,
    @Param('status') status: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<PruefungResponseDto> {
    return this.service.statusChange(id, user, status);
  }

  @ApiOperation({ summary: 'Legt einen Meilenstein an (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 201, type: PruefungsMeilensteinResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Post(':id/meilensteine')
  addMeilenstein(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateMeilensteinDto,
  ): Promise<PruefungsMeilensteinResponseDto> {
    return this.service.addMeilenstein(id, user, dto);
  }

  @ApiOperation({ summary: 'Aktualisiert einen Meilenstein (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 200, type: PruefungsMeilensteinResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Patch(':id/meilensteine/:meilensteinId')
  updateMeilenstein(
    @Param('id') id: string,
    @Param('meilensteinId') meilensteinId: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateMeilensteinDto,
  ): Promise<PruefungsMeilensteinResponseDto> {
    return this.service.updateMeilenstein(id, meilensteinId, user, dto);
  }

  @ApiOperation({ summary: 'Markiert einen Meilenstein als erledigt' })
  @ApiResponse({ status: 200, type: PruefungsMeilensteinResponseDto })
  @Post(':id/meilensteine/:meilensteinId/complete')
  completeMeilenstein(
    @Param('id') id: string,
    @Param('meilensteinId') meilensteinId: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<PruefungsMeilensteinResponseDto> {
    return this.service.completeMeilenstein(id, meilensteinId, user);
  }

  @ApiOperation({ summary: 'Löscht eine Prüfung (nur angemeldet)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}