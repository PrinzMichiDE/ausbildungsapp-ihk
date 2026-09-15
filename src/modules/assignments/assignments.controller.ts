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
import { EinsatzService } from './assignments.service.js';
import {
  CreateEinsatzDto,
  EinsatzResponseDto,
  UpdateEinsatzDto,
} from './dto/assignments.dto.js';

@ApiTags('einsatz')
@ApiBearerAuth()
@Controller({ path: 'einsatz', version: '1' })
export class EinsatzController {
  constructor(private readonly service: EinsatzService) {}

  @ApiOperation({ summary: 'Legt einen Abteilungseinsatz an (Ausbilder)' })
  @ApiResponse({ status: 201, type: EinsatzResponseDto })
  @Roles(Role.ausbilder)
  @Post()
  create(@Body() dto: CreateEinsatzDto): Promise<EinsatzResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listet Einsätze (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [EinsatzResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<EinsatzResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Rotationsplan (aktiv & zukünftig)' })
  @ApiResponse({ status: 200 })
  @Get('plan')
  getPlan(@CurrentUser() user: CurrentUser) {
    return this.service.getPlan(user);
  }

  @ApiOperation({ summary: 'Liefert einen Einsatz' })
  @ApiResponse({ status: 200, type: EinsatzResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<EinsatzResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Aktualisiert einen Einsatz (Ausbilder)' })
  @ApiResponse({ status: 200, type: EinsatzResponseDto })
  @Roles(Role.ausbilder)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEinsatzDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<EinsatzResponseDto> {
    return this.service.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Löscht einen Einsatz (Ausbilder)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.ausbilder)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}
