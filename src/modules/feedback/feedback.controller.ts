import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FeedbackService } from './feedback.service.js';
import { CreateFeedbackDto, FeedbackResponseDto } from './dto/feedback.dto.js';

@ApiTags('feedback')
@ApiBearerAuth()
@Controller({ path: 'feedback', version: '1' })
export class FeedbackController {
  constructor(private readonly service: FeedbackService) {}

  @ApiOperation({ summary: 'Erstellt eine 360-Grad-Bewertung' })
  @ApiResponse({ status: 201, type: FeedbackResponseDto })
  @Post()
  create(
    @CurrentUser() user: CurrentUser,
    @Body() dto: CreateFeedbackDto,
  ): Promise<FeedbackResponseDto> {
    return this.service.create(user, dto);
  }

  @ApiOperation({ summary: 'Listet sichtbares Feedback' })
  @ApiResponse({ status: 200, type: [FeedbackResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<FeedbackResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert ein Feedback' })
  @ApiResponse({ status: 200, type: FeedbackResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<FeedbackResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Löscht ein Feedback' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<void> {
    await this.service.remove(id, user);
  }
}
