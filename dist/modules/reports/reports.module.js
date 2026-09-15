var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { BerichteService } from './reports.service.js';
import { BerichteController } from './reports.controller.js';
import { UserNotificationsModule } from '../notifications/notifications.module.js';
import { AuditModule } from '../audit/audit.module.js';
let BerichteModule = class BerichteModule {
};
BerichteModule = __decorate([
    Module({
        imports: [UserNotificationsModule, AuditModule],
        controllers: [BerichteController],
        providers: [BerichteService],
        exports: [BerichteService],
    })
], BerichteModule);
export { BerichteModule };
//# sourceMappingURL=reports.module.js.map