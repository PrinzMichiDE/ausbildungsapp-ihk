import { Module } from '@nestjs/common';
import { DatenschutzService } from './data-privacy.service.js';
import { DatenschutzController } from './data-privacy.controller.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  imports: [AuditModule],
  controllers: [DatenschutzController],
  providers: [DatenschutzService],
  exports: [DatenschutzService],
})
export class DatenschutzModule {}