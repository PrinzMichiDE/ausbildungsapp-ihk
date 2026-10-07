import { Module } from '@nestjs/common';
import { NotenService } from './grades.service.js';
import { NotenController } from './grades.controller.js';
import { AuditModule } from '../audit/audit.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  controllers: [NotenController],
  providers: [NotenService],
  imports: [AuditModule, NotificationsModule],
  exports: [NotenService],
})
export class NotenModule {}
