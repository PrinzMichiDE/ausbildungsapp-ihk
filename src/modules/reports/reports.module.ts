import { Module } from '@nestjs/common';
import { BerichteService } from './reports.service.js';
import { BerichteController } from './reports.controller.js';
import { UserNotificationsModule } from '../notifications/notifications.module.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [UserNotificationsModule, AuditModule],
  controllers: [BerichteController],
  providers: [BerichteService],
  exports: [BerichteService],
})
export class BerichteModule {}
