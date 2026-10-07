import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AzubiAkteService } from './azubi-akte.service.js';
import { AzubiAkteOverviewDto } from './dto/azubi-akte.dto.js';

@ApiTags('azubiakte')
@Controller({ path: 'azubiakte', version: '1' })
export class AzubiAkteController {
  constructor(private readonly service: AzubiAkteService) {}

  @Get()
  @ApiOperation({ summary: 'Alle Azubi-Akten (scope-berechtigt)' })
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: CurrentUser) {
    return this.service.findAll(user);
  }

  @Get(':azubiId')
  @ApiOperation({ summary: 'Volle Azubi-Akte abrufen' })
  @ApiBearerAuth()
  async findOne(@CurrentUser() user: CurrentUser, @Param('azubiId') azubiId: string) {
    return this.service.findOne(user, azubiId);
  }

  @Get(':azubiId/ueberblick')
  @ApiOperation({ summary: 'Azubi-Kennzahlen' })
  @ApiBearerAuth()
  async uebersicht(@CurrentUser() user: CurrentUser, @Param('azubiId') azubiId: string) {
    return this.service.findOne(user, azubiId);
  }

  @Get('admin/overview')
  @ApiOperation({ summary: 'Verwaltungsübersicht' })
  @ApiBearerAuth()
  async overview(@CurrentUser() user: CurrentUser) {
    return this.service.overview(user);
  }
}