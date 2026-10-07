import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AusbildungsnachweisService } from './ausbildungsnachweis.service.js';
import { CreateAusbildungsnachweisDto, UpdateAusbildungsnachweisDto, AddCommentDto, AddVersionDto } from './dto/ausbildungsnachweis.dto.js';

@ApiTags('ausbildungsnachweis')
@Controller({ path: 'ausbildungsnachweis', version: '1' })
export class AusbildungsnachweisController {
  constructor(private readonly service: AusbildungsnachweisService) {}

  @Get()
  @ApiOperation({ summary: 'Alle Ausbildungsnachweise auflisten' })
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: CurrentUser) {
    return this.service.findAll(user);
  }

  @Post()
  @ApiOperation({ summary: 'Neuen Ausbildungsnachweis erstellen' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async create(@CurrentUser() user: CurrentUser, @Body() dto: CreateAusbildungsnachweisDto) {
    return this.service.create(user, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ausbildungsnachweis abrufen' })
  @ApiBearerAuth()
  async findOne(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.findOne(user, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Ausbildungsnachweis aktualisieren' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async update(@CurrentUser() user: CurrentUser, @Param('id') id: string, @Body() dto: UpdateAusbildungsnachweisDto) {
    return this.service.update(user, id, dto);
  }

  @Post(':id/einreichen')
  @ApiOperation({ summary: 'Nachweis einreichen' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async submit(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.submit(user, id);
  }

  @Post(':id/pruefen')
  @ApiOperation({ summary: 'Nachweis prüfen' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async review(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.review(user, id);
  }

  @Post(':id/freigeben')
  @ApiOperation({ summary: 'Nachweis freigeben' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin, Role.hr)
  async approve(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.approve(user, id);
  }

  @Post(':id/archivieren')
  @ApiOperation({ summary: 'Nachweis archivieren' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async archive(@CurrentUser() user: CurrentUser, @Param('id') id: string) {
    return this.service.archive(user, id);
  }

  @Post(':id/kommentare')
  @ApiOperation({ summary: 'Kommentar hinzufügen' })
  @ApiBearerAuth()
  async addComment(@CurrentUser() user: CurrentUser, @Param('id') id: string, @Body() dto: AddCommentDto) {
    return this.service.addComment(user, id, dto);
  }

  @Post(':id/versionen')
  @ApiOperation({ summary: 'Neue Version erstellen' })
  @ApiBearerAuth()
  @Roles(Role.ausbilder, Role.admin)
  async addVersion(@CurrentUser() user: CurrentUser, @Param('id') id: string, @Body() dto: AddVersionDto) {
    return this.service.addVersion(user, id, dto);
  }
}