import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { NotenService } from './grades.service.js';
import { CreateGradeDto, GradeResponseDto, GradeVersionResponseDto } from './dto/grade.dto.js';

@ApiTags('noten')
@ApiBearerAuth()
@Controller({ path: 'noten', version: '1' })
export class NotenController {
  constructor(private readonly service: NotenService) {}

  @ApiOperation({ summary: 'Erfasst eine Note (Ausbilder/HR)' })
  @ApiResponse({ status: 201, type: GradeResponseDto })
  @Roles(Role.ausbilder, Role.hr)
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateGradeDto,
  ): Promise<GradeResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Noten (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [GradeResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<GradeResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Frühwarnsystem: Noten ab 4.x' })
  @ApiResponse({ status: 200 })
  @Roles(Role.ausbilder, Role.hr)
  @Get('warnliste')
  warnliste(@CurrentUser() user: CurrentUser) {
    return this.service.getWarnliste(user);
  }

  @ApiOperation({ summary: 'Liefert eine Note' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<GradeResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Bestätigt eine Note (Ausbilder)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder)
  @Post(':id/confirm')
  confirm(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<GradeResponseDto> {
    return this.service.confirm(id, user);
  }

  @ApiOperation({ summary: 'Visiert eine Note (Ausbilder)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder)
  @Post(':id/visieren')
  visieren(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<GradeResponseDto> {
    return this.service.visieren(id, user);
  }

  @ApiOperation({ summary: 'Archiviert eine visierte Note (Ausbilder)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder)
  @Post(':id/archivieren')
  archivieren(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<GradeResponseDto> {
    return this.service.archivieren(id, user);
  }

  @ApiOperation({ summary: 'Bewertet eine Note (Ausbilder/HR)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder, Role.hr)
  @Post(':id/bewerten')
  bewerten(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: { bewertung: string; pruefungsdatum?: Date },
  ): Promise<GradeResponseDto> {
    return this.service.bewerten(id, user, dto);
  }

  @ApiOperation({ summary: 'Lädt Zeugnis hoch (Ausbilder/HR)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder, Role.hr)
  @Post(':id/zeugnis')
  zeugnisUpload(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: { zeugnisUrl: string },
  ): Promise<GradeResponseDto> {
    return this.service.zeugnisUpload(id, user, dto);
  }

  @ApiOperation({ summary: 'Dokumentiert Wiederholung (Ausbilder/HR)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder, Role.hr)
  @Post(':id/wiederholung')
  wiederholung(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: { maßnahme?: string },
  ): Promise<GradeResponseDto> {
    return this.service.wiederholung(id, user, dto);
  }

  @ApiOperation({ summary: 'Fügt Fördermaßnahme hinzu (Ausbilder/HR)' })
  @ApiResponse({ status: 200, type: GradeResponseDto })
  @Roles(Role.ausbilder, Role.hr)
  @Post(':id/maßnahme')
  addMaßnahme(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: { maßnahme: string },
  ): Promise<GradeResponseDto> {
    return this.service.addMaßnahme(id, user, dto);
  }

  @ApiOperation({ summary: 'Versionshistorie einer Note' })
  @ApiResponse({ status: 200, type: [GradeVersionResponseDto] })
  @Get(':id/versions')
  getVersions(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getVersions(id, user);
  }

  @ApiOperation({ summary: 'Diff zwischen zwei Versionen' })
  @ApiResponse({ status: 200 })
  @Get(':id/versions/:v1/diff/:v2')
  getDiff(
    @Param('id') id: string,
    @Param('v1') v1: number,
    @Param('v2') v2: number,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getDiff(id, user, v1, v2);
  }

  @ApiOperation({ summary: 'GPA eines Azubis' })
  @ApiResponse({ status: 200 })
  @Get(':id/gpa')
  getGPA(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ) {
    return this.service.getGPA(id, user);
  }

  @ApiOperation({ summary: 'Noten-Tracker Dashboard' })
  @ApiResponse({ status: 200 })
  @Get('dashboard')
  dashboard(
    @CurrentUser() user: CurrentUser,
    @Query() query?: { fach?: string; halbjahr?: string; zeitraum?: string },
  ) {
    return this.service.getDashboard(user, query);
  }

  @ApiOperation({ summary: 'Löscht eine Note (Ausbilder/HR)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.ausbilder, Role.hr)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}
