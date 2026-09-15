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
import { FrameworksService } from './frameworks.service.js';
import {
  CreateFrameworkDto,
  FrameworkResponseDto,
  UpdateFrameworkDto,
} from './dto/learning-content.dto.js';

@ApiTags('frameworks')
@ApiBearerAuth()
@Controller({ path: 'frameworks', version: '1' })
export class FrameworksController {
  constructor(private readonly service: FrameworksService) {}

  @ApiOperation({ summary: 'Erstellt einen IHK-Rahmenplan-Eintrag' })
  @ApiResponse({ status: 201, type: FrameworkResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Post()
  create(@Body() dto: CreateFrameworkDto): Promise<FrameworkResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listet Rahmenplan-Einträge' })
  @ApiResponse({ status: 200, type: [FrameworkResponseDto] })
  @Get()
  findAll(): Promise<FrameworkResponseDto[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Liefert Rahmenplan inkl. Kurse/Aufgaben' })
  @ApiResponse({ status: 200 })
  @Get(':id/tree')
  getTree(@Param('id') id: string) {
    return this.service.getTree(id);
  }

  @ApiOperation({ summary: 'Liefert einen Rahmenplan-Eintrag' })
  @ApiResponse({ status: 200, type: FrameworkResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FrameworkResponseDto> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Aktualisiert einen Rahmenplan-Eintrag' })
  @ApiResponse({ status: 200, type: FrameworkResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFrameworkDto,
  ): Promise<FrameworkResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Löscht einen Rahmenplan-Eintrag' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.admin, Role.ausbilder)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
