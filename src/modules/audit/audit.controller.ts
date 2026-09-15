import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { AuditService } from './audit.service.js';
import { AuditResponseDto } from './dto/audit.dto.js';

@ApiTags('audit')
@ApiBearerAuth()
@Controller({ path: 'audit', version: '1' })
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @ApiOperation({ summary: 'Listet Audit-Events (Admin/HR/Ausbilder sehen alle, Azubi nur eigene)' })
  @ApiResponse({ status: 200, type: [AuditResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<AuditResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert ein einzelnes Audit-Event' })
  @ApiResponse({ status: 200, type: AuditResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<AuditResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Erstellt ein Audit-Event (intern/Service)' })
  @ApiResponse({ status: 201, type: AuditResponseDto })
  @Roles(Role.ausbilder, Role.hr, Role.admin)
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() body: { action: string; entity?: string; entityId?: string; details?: string; ipAddress?: string; userAgent?: string },
  ): Promise<AuditResponseDto> {
    return this.service.create(user, body);
  }
}