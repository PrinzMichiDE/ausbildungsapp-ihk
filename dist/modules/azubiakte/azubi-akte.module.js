var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { AzubiAkteController } from './azubi-akte.controller.js';
import { AzubiAkteService } from './azubi-akte.service.js';
import { AuditModule } from '../audit/audit.module.js';
let AzubiAkteModule = class AzubiAkteModule {
};
AzubiAkteModule = __decorate([
    Module({
        controllers: [AzubiAkteController],
        providers: [AzubiAkteService],
        imports: [AuditModule],
    })
], AzubiAkteModule);
export { AzubiAkteModule };
//# sourceMappingURL=azubi-akte.module.js.map