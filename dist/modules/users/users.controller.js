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
import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import { UsersService } from './users.service.js';
import { CreateUserDto, MfaDisableDto, MfaEnableDto, MfaSecretDto, UpdateUserDto, UserResponseDto, } from './dto/user.dto.js';
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(dto) {
        return this.usersService.create(dto);
    }
    findAll(user) {
        return this.usersService.findAll(user);
    }
    findOne(id, user) {
        const isSelf = id === user.id;
        const privileged = user.roles.some((r) => [Role.admin, Role.hr, Role.ausbilder].includes(r));
        if (!isSelf && !privileged) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Kein Zugriff auf diesen Nutzer',
            });
        }
        return this.usersService.findById(id);
    }
    update(id, dto, user) {
        return this.usersService.update(id, dto, user);
    }
    async remove(id, user) {
        await this.usersService.remove(id, user);
    }
    generateMfaSecret(user) {
        return this.usersService.generateMfaSecret(user);
    }
    enableMfa(user, dto) {
        return this.usersService.enableMfa(user, dto);
    }
    disableMfa(user, dto) {
        return this.usersService.disableMfa(user, dto);
    }
};
__decorate([
    ApiOperation({ summary: 'Legt einen neuen Nutzer an (Admin)' }),
    ApiResponse({ status: 201, type: UserResponseDto }),
    ApiResponse({ status: 409, description: 'E-Mail bereits vergeben' }),
    Roles(Role.admin),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet alle Nutzer (Admin/HR/Ausbilder)' }),
    ApiResponse({ status: 200, type: [UserResponseDto] }),
    Roles(Role.admin, Role.hr, Role.ausbilder),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert einen Nutzer' }),
    ApiResponse({ status: 200, type: UserResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Aktualisiert Rollen/Abteilungen (Admin/HR)' }),
    ApiResponse({ status: 200, type: UserResponseDto }),
    Roles(Role.admin, Role.hr),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Löscht einen Nutzer (Admin)' }),
    ApiResponse({ status: 204, description: 'Erfolgreich gelöscht' }),
    Roles(Role.admin),
    Delete(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    ApiOperation({ summary: 'Erzeugt ein MFA/TOTP-Geheimnis (eigener Nutzer)' }),
    ApiResponse({ status: 200, type: MfaSecretDto }),
    Post('me/mfa/secret'),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "generateMfaSecret", null);
__decorate([
    ApiOperation({ summary: 'Aktiviert MFA (eigener Nutzer)' }),
    ApiResponse({ status: 200, type: UserResponseDto }),
    Post('me/mfa/enable'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, MfaEnableDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "enableMfa", null);
__decorate([
    ApiOperation({ summary: 'Deaktiviert MFA (eigener Nutzer)' }),
    ApiResponse({ status: 200, type: UserResponseDto }),
    Post('me/mfa/disable'),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, MfaDisableDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "disableMfa", null);
UsersController = __decorate([
    ApiTags('users'),
    ApiBearerAuth(),
    Controller({ path: 'users', version: '1' }),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map