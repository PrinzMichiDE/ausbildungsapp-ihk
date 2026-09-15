var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ProjektService } from './projects.service.js';
import { ProjektController } from './projects.controller.js';
let ProjekteModule = class ProjekteModule {
};
ProjekteModule = __decorate([
    Module({
        controllers: [ProjektController],
        providers: [ProjektService],
        exports: [ProjektService],
    })
], ProjekteModule);
export { ProjekteModule };
//# sourceMappingURL=projects.module.js.map