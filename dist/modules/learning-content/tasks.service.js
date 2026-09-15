var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Role } from '../../common/constants/roles.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const framework = await this.prisma.framework.findUnique({
            where: { id: dto.frameworkId },
        });
        if (!framework) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.FRAMEWORK_NOT_FOUND,
                message: `Framework ${dto.frameworkId} nicht gefunden`,
            });
        }
        const task = await this.prisma.task.create({
            data: {
                frameworkId: dto.frameworkId,
                courseId: dto.courseId,
                titel: dto.titel,
                beschreibung: dto.beschreibung,
                musterloesung: dto.musterloesung,
                freigegeben: false,
            },
        });
        return this.toResponse(task);
    }
    async findAll(currentUser) {
        const releasedOnly = !this.canRelease(currentUser);
        const tasks = await this.prisma.task.findMany({
            where: releasedOnly ? { freigegeben: true } : {},
            orderBy: { titel: 'asc' },
        });
        return tasks.map((t) => this.toResponse(t));
    }
    async findOne(id, currentUser) {
        const task = await this.prisma.task.findUnique({ where: { id } });
        if (!task) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.TASK_NOT_FOUND,
                message: `Task ${id} nicht gefunden`,
            });
        }
        if (!task.freigegeben && !this.canRelease(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.COURSE_NOT_RELEASED,
                message: 'Aufgabe ist noch nicht freigegeben',
            });
        }
        return this.toResponse(task);
    }
    async release(id, currentUser) {
        this.assertReleaser(currentUser);
        await this.findOne(id, currentUser);
        const task = await this.prisma.task.update({
            where: { id },
            data: { freigegeben: true },
        });
        return this.toResponse(task);
    }
    async unrelease(id, currentUser) {
        this.assertReleaser(currentUser);
        await this.findOne(id, currentUser);
        const task = await this.prisma.task.update({
            where: { id },
            data: { freigegeben: false },
        });
        return this.toResponse(task);
    }
    async update(id, dto, currentUser) {
        this.assertReleaser(currentUser);
        await this.findOne(id, currentUser);
        const task = await this.prisma.task.update({
            where: { id },
            data: {
                ...(dto.frameworkId ? { frameworkId: dto.frameworkId } : {}),
                ...(dto.courseId !== undefined ? { courseId: dto.courseId } : {}),
                ...(dto.titel ? { titel: dto.titel } : {}),
                ...(dto.beschreibung !== undefined ? { beschreibung: dto.beschreibung } : {}),
                ...(dto.musterloesung !== undefined ? { musterloesung: dto.musterloesung } : {}),
            },
        });
        return this.toResponse(task);
    }
    async remove(id) {
        await this.prisma.task.delete({ where: { id } });
    }
    canRelease(user) {
        return user.roles.some((r) => r === Role.ausbilder || r === Role.admin);
    }
    assertReleaser(user) {
        if (!this.canRelease(user)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.ACCESS_DENIED,
                message: 'Nur Ausbilder/Admin dürfen freigeben',
            });
        }
    }
    toResponse(task) {
        return {
            id: task.id,
            frameworkId: task.frameworkId,
            courseId: task.courseId,
            titel: task.titel,
            beschreibung: task.beschreibung,
            musterloesung: task.musterloesung,
            freigegeben: task.freigegeben,
            kiGeneriert: task.kiGeneriert,
        };
    }
};
TasksService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], TasksService);
export { TasksService };
//# sourceMappingURL=tasks.service.js.map