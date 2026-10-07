import { Module } from '@nestjs/common';
import { AusbildungsnachweisController } from './ausbildungsnachweis.controller.js';
import { AusbildungsnachweisService } from './ausbildungsnachweis.service.js';
import { AuditModule } from '../audit/audit.module.js';

@Module({
  controllers: [AusbildungsnachweisController],
  providers: [AusbildungsnachweisService],
  imports: [AuditModule],
})
export class AusbildungsnachweisModule {}