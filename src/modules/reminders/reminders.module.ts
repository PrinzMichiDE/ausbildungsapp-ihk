import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ReminderService } from './reminder.service.js';
import { UserNotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [ScheduleModule.forRoot(), UserNotificationsModule],
  providers: [ReminderService],
})
export class RemindersModule {}
