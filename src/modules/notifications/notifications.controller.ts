import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { NotificationsService } from './notifications.service.js';
import {
  NotificationPreferenceResponseDto,
  NotificationResponseDto,
  UnreadCountDto,
  UpdateNotificationPreferencesDto,
} from './dto/notification.dto.js';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @ApiOperation({ summary: 'Listet eigene Benachrichtigungen' })
  @ApiResponse({ status: 200, type: [NotificationResponseDto] })
  @Get()
  findAll(
    @CurrentUser() user: CurrentUser,
    @Query() query: PaginationQueryDto,
  ) {
    return this.service.findAll(user, query);
  }

  @ApiOperation({ summary: 'Zählt ungelesene Benachrichtigungen' })
  @ApiResponse({ status: 200, type: UnreadCountDto })
  @Get('unread-count')
  unreadCount(@CurrentUser() user: CurrentUser): Promise<UnreadCountDto> {
    return this.service.unreadCount(user).then((count) => ({ count }));
  }

  @ApiOperation({ summary: 'Markiert alle eigenen Benachrichtigungen als gelesen' })
  @ApiResponse({ status: 200 })
  @Patch('read-all')
  markAllRead(@CurrentUser() user: CurrentUser) {
    return this.service.markAllRead(user);
  }

  @ApiOperation({ summary: 'Markiert eine Benachrichtigung als gelesen' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  @Patch(':id/read')
  markRead(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<NotificationResponseDto> {
    return this.service.markRead(id, user);
  }

  @ApiOperation({ summary: 'Quittiert eine Benachrichtigung (z.B. Freigabe)' })
  @ApiResponse({ status: 200, type: NotificationResponseDto })
  @Patch(':id/acknowledge')
  markAcknowledged(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<NotificationResponseDto> {
    return this.service.markAcknowledged(id, user);
  }

  @ApiOperation({ summary: 'Liefert die Benachrichtigungskanäle des Nutzers' })
  @ApiResponse({ status: 200, type: [NotificationPreferenceResponseDto] })
  @Get('preferences')
  getPreferences(
    @CurrentUser() user: CurrentUser,
  ): Promise<NotificationPreferenceResponseDto[]> {
    return this.service.getPreferences(user);
  }

  @ApiOperation({ summary: 'Speichert die Benachrichtigungskanäle des Nutzers' })
  @ApiResponse({ status: 200, type: [NotificationPreferenceResponseDto] })
  @Put('preferences')
  updatePreferences(
    @CurrentUser() user: CurrentUser,
    @Body() dto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferenceResponseDto[]> {
    return this.service.updatePreferences(user, dto);
  }
}