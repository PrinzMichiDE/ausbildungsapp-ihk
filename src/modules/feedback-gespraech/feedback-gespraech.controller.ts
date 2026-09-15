import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FeedbackGespraechService } from './feedback-gespraech.service.js';
import { CreateFeedbackGespraechDto, UpdateFeedbackGespraechDto, CreateVereinbarungDto } from './dto/feedback-gespraech.dto.js';

@ApiTags('feedback-gespraeche') @ApiBearerAuth()
@Controller({ path: 'feedback-gespraeche', version: '1' })
export class FeedbackGespraechController {
  constructor(private svc: FeedbackGespraechService) {}
  @Post() create(@CurrentUser() u: any, @Body() dto: CreateFeedbackGespraechDto){ return this.svc.create(u,dto); }
  @Get() findAll(@CurrentUser() u: any){ return this.svc.findAll(u); }
  @Get(':id') findOne(@CurrentUser() u: any, @Param('id') id:string){ return this.svc.findOne(id,u); }
  @Patch(':id') update(@CurrentUser() u: any, @Param('id') id:string, @Body() dto:UpdateFeedbackGespraechDto){ return this.svc.update(id,u,dto); }
  @Post(':id/vereinbarungen') addVereinbarung(@CurrentUser() u: any, @Param('id') id:string, @Body() dto:CreateVereinbarungDto){ return this.svc.addVereinbarung(id,u,dto); }
  @Patch(':id/vereinbarungen/:vid/erledigt') complete(@CurrentUser() u: any, @Param('id') id:string, @Param('vid') vid:string){ return this.svc.completeVereinbarung(id,vid,u); }
}
