var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { RawResponse } from '../../common/decorators/raw-response.decorator.js';
import { HealthService } from './health.service.js';
let HealthController = class HealthController {
    healthService;
    constructor(healthService) {
        this.healthService = healthService;
    }
    check() {
        return this.healthService.check();
    }
    readiness() {
        return this.healthService.readiness();
    }
};
__decorate([
    Get(),
    Public(),
    ApiOperation({ summary: 'Liveness check — App läuft' }),
    ApiResponse({ status: 200, description: 'App ist erreichbar' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Object)
], HealthController.prototype, "check", null);
__decorate([
    Get('readiness'),
    Public(),
    ApiOperation({ summary: 'Readiness check — App + DB sind bereit' }),
    ApiResponse({ status: 200, description: 'App und DB sind verbunden' }),
    ApiResponse({ status: 503, description: 'DB nicht erreichbar' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "readiness", null);
HealthController = __decorate([
    ApiTags('Health'),
    Controller({ path: 'health', version: '1' }),
    RawResponse(),
    __metadata("design:paramtypes", [HealthService])
], HealthController);
export { HealthController };
//# sourceMappingURL=health.controller.js.map