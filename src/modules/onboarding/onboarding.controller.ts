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
import { OnboardingService } from './onboarding.service.js';
import {
  ChecklistResponseDto,
  CreateChecklistDto,
  UpdateChecklistItemDto,
} from './dto/checklist.dto.js';

@ApiTags('onboarding')
@ApiBearerAuth()
@Controller({ path: 'onboarding/checklisten', version: '1' })
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @ApiOperation({ summary: 'Legt eine Onboarding-Checkliste an (Ausbilder/Admin)' })
  @ApiResponse({ status: 201, type: ChecklistResponseDto })
  @Roles(Role.ausbilder, Role.admin)
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateChecklistDto,
  ): Promise<ChecklistResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Checklisten (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [ChecklistResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<ChecklistResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert eine Checkliste' })
  @ApiResponse({ status: 200, type: ChecklistResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ChecklistResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Setzt den Erledigt-Status eines Items' })
  @ApiResponse({ status: 200, type: ChecklistResponseDto })
  @Patch(':id/items/:itemId')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateChecklistItemDto,
  ): Promise<ChecklistResponseDto> {
    return this.service.updateItem(id, itemId, user, dto);
  }

  @ApiOperation({ summary: 'Löscht eine Checkliste (Ausbilder/Admin)' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.ausbilder, Role.admin)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}
