import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { StandortService } from './standort.service.js';
import { CreateStandortDto, UpdateStandortDto } from './dto/standort.dto.js';

@ApiTags('standort')
@Controller({ path: 'standort', version: '1' })
export class StandortController {
  constructor(private readonly service: StandortService) {}

  @Get()
  @ApiOperation({ summary: 'Alle Standorte auflisten' })
  @ApiBearerAuth()
  @Roles(Role.admin, Role.ausbildungsbeauftragter, Role.ausbilder, Role.hr)
  async findAll(@CurrentUser() user: CurrentUser) {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Neuen Standort erstellen' })
  @ApiBearerAuth()
  @Roles(Role.admin)
  async create(@CurrentUser() user: CurrentUser, @Body() dto: CreateStandortDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Standort abrufen' })
  @ApiBearerAuth()
  async findOne(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Standort aktualisieren' })
  @ApiBearerAuth()
  @Roles(Role.admin)
  async update(@CurrentUser() user: CurrentUser, @Param('id') id: string, @Body() dto: UpdateStandortDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Standort löschen' })
  @ApiBearerAuth()
  @Roles(Role.admin)
  async remove(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.remove(id);
  }
}