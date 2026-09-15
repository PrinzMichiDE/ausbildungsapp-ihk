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
import { Body, Controller, Delete, Get, Param, Patch, Post, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { TasksService } from './tasks.service.js';
import { CreateTaskDto, TaskResponseDto, UpdateTaskDto, } from './dto/learning-content.dto.js';
let TasksController = class TasksController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(user) {
        return this.service.findAll(user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user);
    }
    release(id, user) {
        return this.service.release(id, user);
    }
    unrelease(id, user) {
        return this.service.unrelease(id, user);
    }
    async remove(id) {
        await this.service.remove(id);
    }
};
__decorate([
    ApiOperation({ summary: 'Erstellt eine Praxisaufgabe (Entwurf)' }),
    ApiResponse({ status: 201, type: TaskResponseDto }),
    Roles(Role.admin, Role.ausbilder),
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    ApiOperation({ summary: 'Listet Aufgaben (Azubis nur freigegebene)' }),
    ApiResponse({ status: 200, type: [TaskResponseDto] }),
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    ApiOperation({ summary: 'Liefert eine Aufgabe' }),
    ApiResponse({ status: 200, type: TaskResponseDto }),
    Get(':id'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    ApiOperation({ summary: 'Bearbeitet eine Aufgabe (Entwurf)' }),
    ApiResponse({ status: 200, type: TaskResponseDto }),
    Roles(Role.admin, Role.ausbilder),
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    ApiOperation({ summary: 'Gibt eine Aufgabe für Azubis frei' }),
    ApiResponse({ status: 200, type: TaskResponseDto }),
    Roles(Role.ausbilder, Role.admin),
    Post(':id/release'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "release", null);
__decorate([
    ApiOperation({ summary: 'Zieht die Freigabe einer Aufgabe zurück' }),
    ApiResponse({ status: 200, type: TaskResponseDto }),
    Roles(Role.ausbilder, Role.admin),
    Post(':id/unrelease'),
    __param(0, Param('id')),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "unrelease", null);
__decorate([
    ApiOperation({ summary: 'Löscht eine Aufgabe' }),
    ApiResponse({ status: 204, description: 'Gelöscht' }),
    Roles(Role.admin, Role.ausbilder),
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
TasksController = __decorate([
    ApiTags('tasks'),
    ApiBearerAuth(),
    Controller({ path: 'tasks', version: '1' }),
    __metadata("design:paramtypes", [TasksService])
], TasksController);
export { TasksController };
//# sourceMappingURL=tasks.controller.js.map