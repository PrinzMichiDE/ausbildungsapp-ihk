import { Global, Module } from '@nestjs/common';
import { TeamsNotificationService } from './teams-notification.service.js';

@Global()
@Module({
  providers: [TeamsNotificationService],
  exports: [TeamsNotificationService],
})
export class NotificationsModule {}
