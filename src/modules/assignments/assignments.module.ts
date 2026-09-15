import { Module } from '@nestjs/common';
import { EinsatzService } from './assignments.service.js';
import { EinsatzController } from './assignments.controller.js';

@Module({
  controllers: [EinsatzController],
  providers: [EinsatzService],
  exports: [EinsatzService],
})
export class EinsatzModule {}
