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
let AbteilungenService = class AbteilungenService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const abteilung = await this.prisma.abteilung.create({ data: dto });
        return this.toResponse(abteilung);
    }
    async findAll() {
        const abteilungen = await this.prisma.abteilung.findMany({
            orderBy: { name: 'asc' },
        });
        return abteilungen.map((a) => this.toResponse(a));
    }
    async findOne(id) {
        const abteilung = await this.prisma.abteilung.findUnique({
            where: { id },
        });
        if (!abteilung) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.NOT_FOUND,
                message: `Abteilung ${id} nicht gefunden`,
            });
        }
        return this.toResponse(abteilung);
    }
    async update(id, dto) {
        await this.findOne(id);
        const abteilung = await this.prisma.abteilung.update({
            where: { id },
            data: dto,
        });
        return this.toResponse(abteilung);
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.abteilung.delete({ where: { id } });
    }
    toResponse(abteilung) {
        return {
            id: abteilung.id,
            name: abteilung.name,
            kurzzeichen: abteilung.kurzzeichen,
            beschreibung: abteilung.beschreibung,
        };
    }
};
AbteilungenService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], AbteilungenService);
export { AbteilungenService };
//# sourceMappingURL=departments.service.js.map