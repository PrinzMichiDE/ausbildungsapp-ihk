import { Module } from '@nestjs/common';
import { PruefungService } from './exams.service.js';
import { PruefungController } from './exams.controller.js';

@Module({
  controllers: [PruefungController],
  providers: [PruefungService],
  exports: [PruefungService],
})
export class PruefungenModule {}