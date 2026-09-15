var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { FrameworksService } from './frameworks.service.js';
import { CoursesService } from './courses.service.js';
import { TasksService } from './tasks.service.js';
import { AiImportService } from './ai-import.service.js';
import { FrameworksController } from './frameworks.controller.js';
import { CoursesController } from './courses.controller.js';
import { TasksController } from './tasks.controller.js';
import { AiDocumentsController } from './ai-documents.controller.js';
let LerninhalteModule = class LerninhalteModule {
};
LerninhalteModule = __decorate([
    Module({
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
], LerninhalteModule);
export { LerninhalteModule };
//# sourceMappingURL=learning-content.module.js.map