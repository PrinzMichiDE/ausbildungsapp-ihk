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
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { AbteilungenService } from './departments.service.js';
import {
  AbteilungResponseDto,
  CreateAbteilungDto,
  UpdateAbteilungDto,
} from './dto/abteilung.dto.js';

@ApiTags('abteilungen')
@ApiBearerAuth()
@Controller({ path: 'abteilungen', version: '1' })
export class AbteilungenController {
  constructor(private readonly service: AbteilungenService) {}

  @ApiOperation({ summary: 'Erstellt eine Abteilung (Admin)' })
  @ApiResponse({ status: 201, type: AbteilungResponseDto })
  @Roles(Role.admin)
  @Post()
  create(@Body() dto: CreateAbteilungDto): Promise<AbteilungResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listet alle Abteilungen' })
  @ApiResponse({ status: 200, type: [AbteilungResponseDto] })
  @Roles(Role.admin, Role.ausbildungsbeauftragter, Role.ausbilder, Role.hr)
  @Get()
  findAll(): Promise<AbteilungResponseDto[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Liefert eine Abteilung' })
  @ApiResponse({ status: 200, type: AbteilungResponseDto })
  @Roles(Role.admin, Role.ausbildungsbeauftragter, Role.ausbilder, Role.hr)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AbteilungResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Aktualisiert eine Abteilung (Admin)' })
  @ApiResponse({ status: 200, type: AbteilungResponseDto })
  @Roles(Role.admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAbteilungDto,
  ): Promise<AbteilungResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Löscht eine Abteilung (Admin)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
