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
import { ZertifikateService } from './certificates.service.js';
import {
  CreateZertifikatDto,
  UpdateZertifikatDto,
  ZertifikatResponseDto,
} from './dto/zertifikat.dto.js';

@ApiTags('zertifikate')
@ApiBearerAuth()
@Controller({ path: 'zertifikate', version: '1' })
export class ZertifikateController {
  constructor(private readonly service: ZertifikateService) {}

  @ApiOperation({ summary: 'Legt ein Zertifikat an' })
  @ApiResponse({ status: 201, type: ZertifikatResponseDto })
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateZertifikatDto,
  ): Promise<ZertifikatResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet Zertifikate (scope-berechtigt)' })
  @ApiResponse({ status: 200, type: [ZertifikatResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<ZertifikatResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert ein Zertifikat' })
  @ApiResponse({ status: 200, type: ZertifikatResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<ZertifikatResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Aktualisiert ein Zertifikat' })
  @ApiResponse({ status: 200, type: ZertifikatResponseDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateZertifikatDto,
  ): Promise<ZertifikatResponseDto> {
    return this.service.update(id, user, dto);
  }

  @ApiOperation({ summary: 'Löscht ein Zertifikat' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}
