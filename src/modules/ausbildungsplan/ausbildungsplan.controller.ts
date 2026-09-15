import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AusbildungsplanService } from './ausbildungsplan.service.js';
import { CreateAusbildungsplanDto, UpdateAusbildungsplanDto } from './dto/ausbildungsplan.dto.js';

@ApiTags('ausbildungsplan')
@Controller({ path: 'ausbildungsplan', version: '1' })
export class AusbildungsplanController {
  constructor(private readonly service: AusbildungsplanService) {}

  @Get()
  @ApiOperation({ summary: 'Alle Ausbildungspläne auflisten' })
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: CurrentUser) {
    return this.service.findAll(user);
  }

  @Post()
  @ApiOperation({ summary: 'Neuen Ausbildungsplan erstellen' })
  @ApiBearerAuth()
  async create(@CurrentUser() user: CurrentUser, @Body() dto: CreateAusbildungsplanDto) {
    return this.service.create(user, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ausbildungsplan详情' })
  @ApiBearerAuth()
  async findOne(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.findOne(user, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Ausbildungsplan aktualisieren' })
  @ApiBearerAuth()
  async update(@CurrentUser() user: CurrentUser, @Param('id') id: string, @Body() dto: UpdateAusbildungsplanDto) {
    return this.service.update(user, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Ausbildungsplan löschen' })
  @ApiBearerAuth()
  async remove(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.remove(user, id);
  }

  @Post(':id/einreichen')
  @ApiOperation({ summary: 'Ausbildungsplan einreichen' })
  @ApiBearerAuth()
  @Roles(Role.azubi)
  async submit(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.submit(user, id);
  }

  @Post(':id/pruefen')
  @ApiOperation({ summary: 'Ausbildungsplan prüfen' })
  @ApiBearerAuth()
  @Roles(Role.ausbildungsbeauftragter)
  async review(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.review(user, id);
  }

  @Post(':id/genehmigen')
  @ApiOperation({ summary: 'Ausbildungsplan genehmigen' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async approve(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.approve(user, id);
  }

  @Get(':id/rahmenlehrplan')
  @ApiOperation({ summary: 'Rahmenlehrplan abrufen' })
  @ApiBearerAuth()
  async getRahmenlehrplan(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.getRahmenlehrplan(user, id);
  }
}
