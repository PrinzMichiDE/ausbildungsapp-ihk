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
let CoursesService = class CoursesService {
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
        const course = await this.prisma.course.create({
            data: {
                frameworkId: dto.frameworkId,
                titel: dto.titel,
                beschreibung: dto.beschreibung,
                lernziele: dto.lernziele ?? [],
                theorie: dto.theorie,
                freigegeben: false,
            },
        });
        return this.toResponse(course);
    }
    async findAll(currentUser) {
        const releasedOnly = !this.canRelease(currentUser);
        const courses = await this.prisma.course.findMany({
            where: releasedOnly ? { freigegeben: true } : {},
            orderBy: { titel: 'asc' },
        });
        return courses.map((c) => this.toResponse(c));
    }
    async findOne(id, currentUser) {
        const course = await this.prisma.course.findUnique({ where: { id } });
        if (!course) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.COURSE_NOT_FOUND,
                message: `Course ${id} nicht gefunden`,
            });
        }
        if (!course.freigegeben && !this.canRelease(currentUser)) {
            throw new ForbiddenException({
                errorCode: ERROR_CODES.COURSE_NOT_RELEASED,
                message: 'Kurs ist noch nicht freigegeben',
            });
        }
        return this.toResponse(course);
    }
    async release(id, currentUser) {
        this.assertReleaser(currentUser);
        await this.findOne(id, currentUser);
        const course = await this.prisma.course.update({
            where: { id },
            data: { freigegeben: true },
        });
        return this.toResponse(course);
    }
    async unrelease(id, currentUser) {
        this.assertReleaser(currentUser);
        await this.findOne(id, currentUser);
        const course = await this.prisma.course.update({
            where: { id },
            data: { freigegeben: false },
        });
        return this.toResponse(course);
    }
    async update(id, dto, currentUser) {
        this.assertReleaser(currentUser);
        await this.findOne(id, currentUser);
        const course = await this.prisma.course.update({
            where: { id },
            data: {
                ...(dto.frameworkId ? { frameworkId: dto.frameworkId } : {}),
                ...(dto.titel ? { titel: dto.titel } : {}),
                ...(dto.beschreibung !== undefined ? { beschreibung: dto.beschreibung } : {}),
                ...(dto.lernziele !== undefined ? { lernziele: dto.lernziele } : {}),
                ...(dto.theorie !== undefined ? { theorie: dto.theorie } : {}),
            },
        });
        return this.toResponse(course);
    }
    async remove(id) {
        await this.prisma.course.delete({ where: { id } });
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
    toResponse(course) {
        return {
            id: course.id,
            frameworkId: course.frameworkId,
            titel: course.titel,
            beschreibung: course.beschreibung,
            lernziele: course.lernziele,
            theorie: course.theorie,
            freigegeben: course.freigegeben,
            kiGeneriert: course.kiGeneriert,
            qualitaetsScore: course.qualitaetsScore,
        };
    }
};
CoursesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CoursesService);
export { CoursesService };
//# sourceMappingURL=courses.service.js.map