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
import { GamificationService } from './gamification.service.js';
import {
  BadgeResponseDto,
  CreateBadgeDto,
  UserBadgeResponseDto,
} from './dto/badge.dto.js';

@ApiTags('gamification')
@ApiBearerAuth()
@Controller({ path: 'badges', version: '1' })
export class GamificationController {
  constructor(private readonly service: GamificationService) {}

  @ApiOperation({ summary: 'Legt eine Badge-Definition an (Admin)' })
  @ApiResponse({ status: 201, type: BadgeResponseDto })
  @Roles(Role.admin)
  @Post()
  createBadge(@Body() dto: CreateBadgeDto): Promise<BadgeResponseDto> {
    return this.service.createBadge(dto);
  }

  @ApiOperation({ summary: 'Listet alle Badge-Definitionen' })
  @ApiResponse({ status: 200, type: [BadgeResponseDto] })
  @Get()
  listBadges(): Promise<BadgeResponseDto[]> {
    return this.service.listBadges();
  }

  @ApiOperation({ summary: 'Listet vergebene Badges eines Azubis' })
  @ApiResponse({ status: 200, type: [UserBadgeResponseDto] })
  @Get('user/:azubiId')
  listUserBadges(
    @Param('azubiId') azubiId: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<UserBadgeResponseDto[]> {
    return this.service.listUserBadges(user, azubiId);
  }

  @ApiOperation({ summary: 'Verleiht ein Badge (Ausbilder/Admin)' })
  @ApiResponse({ status: 201, type: UserBadgeResponseDto })
  @Roles(Role.ausbilder, Role.admin)
  @Post(':azubiId/:schluessel')
  award(
    @Param('azubiId') azubiId: string,
    @Param('schluessel') schluessel: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<UserBadgeResponseDto> {
    return this.service.awardBadge(user, azubiId, schluessel);
  }
}
