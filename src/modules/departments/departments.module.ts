import { Module } from '@nestjs/common';
import { AbteilungenService } from './departments.service.js';
import { AbteilungenController } from './departments.controller.js';

@Module({
  controllers: [AbteilungenController],
  providers: [AbteilungenService],
  exports: [AbteilungenService],
})
export class AbteilungenModule {}
