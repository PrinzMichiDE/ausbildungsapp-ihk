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
import { Body, Controller, Post, Req, } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { AuthService } from './auth.service.js';
import { AuthResponseDto, LoginDto, MfaPendingResponseDto, MfaVerifyDto, RefreshDto, } from './dto/auth.dto.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login(dto, req) {
        const ip = req.headers['x-forwarded-for'] ?? req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'];
        return this.authService.login(dto, ip, userAgent);
    }
    verifyMfa(dto) {
        return this.authService.verifyMfa(dto);
    }
    refresh(dto) {
        return this.authService.refresh(dto);
    }
};
__decorate([
    Public(),
    ApiOperation({ summary: 'Authentifiziert einen Nutzer (ggf. MFA-Schritt)' }),
    ApiResponse({ status: 201, type: AuthResponseDto }),
    ApiResponse({ status: 200, type: MfaPendingResponseDto, description: 'MFA erforderlich' }),
    ApiResponse({ status: 401, description: 'Ungültige Zugangsdaten' }),
    Post('login'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    Public(),
    ApiOperation({ summary: 'Schließt die MFA-Verifikation ab' }),
    ApiResponse({ status: 201, type: AuthResponseDto }),
    Post('verify-mfa'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MfaVerifyDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyMfa", null);
__decorate([
    Public(),
    ApiOperation({ summary: 'Erneuert das Access-Token' }),
    ApiResponse({ status: 201, type: AuthResponseDto }),
    Post('refresh'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
AuthController = __decorate([
    ApiTags('auth'),
    Controller({ path: 'auth', version: '1' }),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map