import { Module } from '@nestjs/common';
import { AzubiAkteController } from './azubi-akte.controller.js';
import { AzubiAkteService } from './azubi-akte.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  controllers: [AzubiAkteController],
  providers: [AzubiAkteService],
  imports: [AuditModule],
})
export class AzubiAkteModule {}