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
import { AbwesenheitService } from './absence.service.js';
import {
  AbwesenheitResponseDto,
  CreateAbwesenheitDto,
  UpdateAbwesenheitDto,
} from './dto/absence.dto.js';

@ApiTags('abwesenheit')
@ApiBearerAuth()
@Controller({ path: 'abwesenheit', version: '1' })
export class AbwesenheitController {
  constructor(private readonly service: AbwesenheitService) {}

  @ApiOperation({ summary: 'Erfasst eine Abwesenheit' })
  @ApiResponse({ status: 201, type: AbwesenheitResponseDto })
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateAbwesenheitDto,
  ): Promise<AbwesenheitResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Abwesenheiten (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [AbwesenheitResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<AbwesenheitResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert eine Abwesenheit' })
  @ApiResponse({ status: 200, type: AbwesenheitResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<AbwesenheitResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Aktualisiert eine Abwesenheit' })
  @ApiResponse({ status: 200, type: AbwesenheitResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateAbwesenheitDto,
  ): Promise<AbwesenheitResponseDto> {
    return this.service.update(id, user, dto);
  }

  @ApiOperation({ summary: 'Löscht eine Abwesenheit' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}
