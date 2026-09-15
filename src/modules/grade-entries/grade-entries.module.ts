import { Module } from '@nestjs/common';
import { GradeentryService } from './grade-entries.service.js';
import { GradeentryController } from './grade-entries.controller.js';

@Module({
  controllers: [GradeentryController],
  providers: [GradeentryService],
  exports: [GradeentryService],
})
export class GradeEntriesModule {}
