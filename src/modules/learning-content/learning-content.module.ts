import { Module } from '@nestjs/common';
import { FrameworksService } from './frameworks.service.js';
import { CoursesService } from './courses.service.js';
import { TasksService } from './tasks.service.js';
import { AiImportService } from './ai-import.service.js';
import { FrameworksController } from './frameworks.controller.js';
import { CoursesController } from './courses.controller.js';
import { TasksController } from './tasks.controller.js';
import { AiDocumentsController } from './ai-documents.controller.js';

@Module({
  controllers: [
    FrameworksController,
    CoursesController,
    TasksController,
    AiDocumentsController,
  ],
  providers: [
    FrameworksService,
    CoursesService,
    TasksService,
    AiImportService,
  ],
  exports: [
    FrameworksService,
    CoursesService,
    TasksService,
    AiImportService,
  ],
})
export class LerninhalteModule {}
