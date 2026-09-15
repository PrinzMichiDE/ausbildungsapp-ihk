import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { GradeentryService } from './grade-entries.service.js';
import { CreateGradeEntryDto, GradeEntryResponseDto } from './dto/grade-entry.dto.js';

@ApiTags('grade-entries')
@ApiBearerAuth()
@Controller({ path: 'grade-entries', version: '1' })
export class GradeentryController {
  constructor(private readonly service: GradeentryService) {}

  @ApiOperation({ summary: 'Erstellt einen Grade-Eintrag' })
  @ApiResponse({ status: 201, type: GradeEntryResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.azubi)
  @Post()
  create(@CurrentUser() user: CurrentUser, @Body() dto: CreateGradeEntryDto): Promise<GradeEntryResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Grade-Entries (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [GradeEntryResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<GradeEntryResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert einen Grade-Entry' })
  @ApiResponse({ status: 200, type: GradeEntryResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUser): Promise<GradeEntryResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Aktualisiert einen Grade-Entry' })
  @ApiResponse({ status: 200, type: GradeEntryResponseDto })
  @Roles(Role.ausbilder, Role.hr)
  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: CurrentUser, @Body() dto: Partial<CreateGradeEntryDto>): Promise<GradeEntryResponseDto> {
    return this.service.update(id, user, dto);
  }

  @ApiOperation({ summary: 'Löscht einen Grade-Entry' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.ausbilder, Role.hr)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUser): Promise<void> {
    return this.service.remove(id, user);
  }
}
