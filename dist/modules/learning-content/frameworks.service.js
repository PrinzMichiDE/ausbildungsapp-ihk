var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
let FrameworksService = class FrameworksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const framework = await this.prisma.framework.create({ data: dto });
        return this.toResponse(framework);
    }
    async findAll() {
        const frameworks = await this.prisma.framework.findMany({
            orderBy: { titel: 'asc' },
        });
        return frameworks.map((f) => this.toResponse(f));
    }
    async findOne(id) {
        const framework = await this.prisma.framework.findUnique({ where: { id } });
        if (!framework) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.FRAMEWORK_NOT_FOUND,
                message: `Framework ${id} nicht gefunden`,
            });
        }
        return this.toResponse(framework);
    }
    async getTree(id) {
        const framework = await this.findOne(id);
        const courses = await this.prisma.course.findMany({
            where: { frameworkId: id },
            orderBy: { titel: 'asc' },
        });
        const tasks = await this.prisma.task.findMany({
            where: { frameworkId: id },
            orderBy: { titel: 'asc' },
        });
        return { framework, courses, tasks };
    }
    async update(id, dto) {
        await this.findOne(id);
        const framework = await this.prisma.framework.update({
            where: { id },
            data: dto,
        });
        return this.toResponse(framework);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.framework.delete({ where: { id } });
    }
    toResponse(framework) {
        return {
            id: framework.id,
            titel: framework.titel,
            lernfeld: framework.lernfeld,
            kompetenz: framework.kompetenz,
            beschreibung: framework.beschreibung,
            quelle: framework.quelle,
            createdAt: framework.createdAt,
        };
    }
};
FrameworksService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], FrameworksService);
export { FrameworksService };
//# sourceMappingURL=frameworks.service.js.map