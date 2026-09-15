import { Module } from '@nestjs/common';
import { FeedbackGespraechService } from './feedback-gespraech.service.js';
import { FeedbackGespraechController } from './feedback-gespraech.controller.js';
@Module({ controllers:[FeedbackGespraechController], providers:[FeedbackGespraechService], exports:[FeedbackGespraechService] })
export class FeedbackGespraechModule {}
