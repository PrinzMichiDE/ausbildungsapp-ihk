import { Module } from '@nestjs/common';
import { AusbildungsplanController } from './ausbildungsplan.controller.js';
import { AusbildungsplanService } from './ausbildungsplan.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  controllers: [AusbildungsplanController],
  providers: [AusbildungsplanService],
  imports: [AuditModule],
  exports: [AusbildungsplanService],
})
export class AusbildungsplanModule {}
