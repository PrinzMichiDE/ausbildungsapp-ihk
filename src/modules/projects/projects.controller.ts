import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ProjektService } from './projects.service.js';
import {
  ProjektResponseDto,
  CreateProjektDto,
  UpdateProjektDto,
} from './dto/projekt.dto.js';

@ApiTags('projekte')
@ApiBearerAuth()
@Controller({ path: 'projekte', version: '1' })
export class ProjektController {
  constructor(private readonly service: ProjektService) {}

  @ApiOperation({ summary: 'Erstellt ein neues Projekt (Azubi)' })
  @ApiResponse({ status: 201, type: ProjektResponseDto })
  @Roles(Role.azubi, Role.ausbilder, Role.hr, Role.admin)
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateProjektDto,
  ): Promise<ProjektResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Projekte (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [ProjektResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<ProjektResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert ein Projekt' })
  @ApiResponse({ status: 200, type: ProjektResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ProjektResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Aktualisiert ein Projekt (Entwurf/Abgelehnt)' })
  @ApiResponse({ status: 200, type: ProjektResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjektDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<ProjektResponseDto> {
    return this.service.update(id, user, dto);
  }

  @ApiOperation({ summary: 'Reicht das Projekt zur Prüfung ein (Azubi)' })
  @ApiResponse({ status: 200, type: ProjektResponseDto })
  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ProjektResponseDto> {
    return this.service.submit(id, user);
  }

  @ApiOperation({ summary: 'Reviewt ein Projekt (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 200, type: ProjektResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Post(':id/review')
  review(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: { bewertung: string; status: 'freigegeben' | 'abgelehnt' },
  ): Promise<ProjektResponseDto> {
    return this.service.review(id, user, dto);
  }

  @ApiOperation({ summary: 'Fordert Überarbeitung an (Ausbilder/HR/Admin)' })
  @ApiResponse({ status: 200, type: ProjektResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Post(':id/revision')
  requestRevision(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ProjektResponseDto> {
    return this.service.requestRevision(id, user);
  }

  @ApiOperation({ summary: 'Archiviert ein Projekt (Ausbilder/Admin)' })
  @ApiResponse({ status: 204, description: 'Archiviert' })
  @Roles(Role.ausbilder, Role.admin)
  @Delete(':id')
  archive(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    return this.service.archive(id, user);
  }

  @ApiOperation({ summary: 'Löscht ein Projekt' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Delete(':id/hard')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}