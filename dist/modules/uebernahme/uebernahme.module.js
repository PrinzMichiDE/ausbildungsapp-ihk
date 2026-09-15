var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from "@nestjs/common";
import { UebernahmegespraechService } from "./uebernahme.service.js";
import { UebernahmegespraechController } from "./uebernahme.controller.js";
let UebernahmeModule = class UebernahmeModule {
};
UebernahmeModule = __decorate([
    Module({ controllers: [UebernahmegespraechController], providers: [UebernahmegespraechService] })
], UebernahmeModule);
export { UebernahmeModule };
//# sourceMappingURL=uebernahme.module.js.map