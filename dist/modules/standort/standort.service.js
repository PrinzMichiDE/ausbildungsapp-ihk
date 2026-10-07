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
let StandortService = class StandortService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const standorte = await this.prisma.standort.findMany({ orderBy: { name: 'asc' } });
        return standorte.map(s => this.toResponse(s));
    }
    async findOne(id) {
        const standort = await this.prisma.standort.findUnique({ where: { id } });
        if (!standort) {
            throw new NotFoundException({ errorCode: ERROR_CODES.NOT_FOUND, message: `Standort ${id} nicht gefunden` });
        }
        return this.toResponse(standort);
    }
    async create(dto) {
        const standort = await this.prisma.standort.create({ data: dto });
        return this.toResponse(standort);
    }
    async update(id, dto) {
        await this.findOne(id);
        const standort = await this.prisma.standort.update({ where: { id }, data: dto });
        return this.toResponse(standort);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.standort.delete({ where: { id } });
    }
    toResponse(s) {
        return {
            id: s.id, name: s.name, adresse: s.adresse, plz: s.plz, ort: s.ort,
        };
    }
};
StandortService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], StandortService);
export { StandortService };
//# sourceMappingURL=standort.service.js.map