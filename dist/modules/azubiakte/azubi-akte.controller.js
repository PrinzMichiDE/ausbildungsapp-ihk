var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.type.js';
import { AzubiAkteService } from './azubi-akte.service.js';
let AzubiAkteController = class AzubiAkteController {
    service;
    constructor(service) {
        this.service = service;
    }
    async findAll(user) {
        return this.service.findAll(user);
    }
    async findOne(user, azubiId) {
        return this.service.findOne(user, azubiId);
    }
    async uebersicht(user, azubiId) {
        return this.service.findOne(user, azubiId);
    }
    async overview(user) {
        return this.service.overview(user);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'Alle Azubi-Akten (scope-berechtigt)' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AzubiAkteController.prototype, "findAll", null);
__decorate([
    Get(':azubiId'),
    ApiOperation({ summary: 'Volle Azubi-Akte abrufen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('azubiId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AzubiAkteController.prototype, "findOne", null);
__decorate([
    Get(':azubiId/ueberblick'),
    ApiOperation({ summary: 'Azubi-Kennzahlen' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __param(1, Param('azubiId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AzubiAkteController.prototype, "uebersicht", null);
__decorate([
    Get('admin/overview'),
    ApiOperation({ summary: 'Verwaltungsübersicht' }),
    ApiBearerAuth(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AzubiAkteController.prototype, "overview", null);
AzubiAkteController = __decorate([
    ApiTags('azubiakte'),
    Controller({ path: 'azubiakte', version: '1' }),
    __metadata("design:paramtypes", [AzubiAkteService])
], AzubiAkteController);
export { AzubiAkteController };
//# sourceMappingURL=azubi-akte.controller.js.map