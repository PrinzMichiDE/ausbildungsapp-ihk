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
import { WikiService } from './wiki.service.js';
import {
  CreateWikiPageDto,
  UpdateWikiPageDto,
  WikiPageResponseDto,
} from './dto/wiki.dto.js';

@ApiTags('wiki')
@ApiBearerAuth()
@Controller({ path: 'wiki', version: '1' })
export class WikiController {
  constructor(private readonly service: WikiService) {}

  @ApiOperation({ summary: 'Erstellt eine Wiki-Seite (Admin/Ausbilder)' })
  @ApiResponse({ status: 201, type: WikiPageResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Post()
  create(@Body() dto: CreateWikiPageDto): Promise<WikiPageResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listet alle Wiki-Seiten' })
  @ApiResponse({ status: 200, type: [WikiPageResponseDto] })
  @Get()
  findAll(): Promise<WikiPageResponseDto[]> {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Liefert eine Wiki-Seite per Slug' })
  @ApiResponse({ status: 200, type: WikiPageResponseDto })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string): Promise<WikiPageResponseDto> {
    return this.service.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Liefert eine Wiki-Seite per ID' })
  @ApiResponse({ status: 200, type: WikiPageResponseDto })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<WikiPageResponseDto> {
    return this.service.getById(id);
  }

  @ApiOperation({ summary: 'Aktualisiert eine Wiki-Seite (Admin/Ausbilder)' })
  @ApiResponse({ status: 200, type: WikiPageResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWikiPageDto,
  ): Promise<WikiPageResponseDto> {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Löscht eine Wiki-Seite (Admin/Ausbilder)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.admin, Role.ausbilder)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
