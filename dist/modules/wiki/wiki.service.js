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
let WikiService = class WikiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const page = await this.prisma.wikiPage.create({
            data: {
                titel: dto.titel,
                slug: dto.slug,
                kategorie: dto.kategorie,
                inhaltMarkdown: dto.inhaltMarkdown,
            },
        });
        return this.toResponse(page);
    }
    async findAll() {
        const pages = await this.prisma.wikiPage.findMany({
            orderBy: [{ kategorie: 'asc' }, { titel: 'asc' }],
        });
        return pages.map((p) => this.toResponse(p));
    }
    async findBySlug(slug) {
        const page = await this.prisma.wikiPage.findUnique({ where: { slug } });
        if (!page) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.WIKI_PAGE_NOT_FOUND,
                message: `Wiki-Seite ${slug} nicht gefunden`,
            });
        }
        return this.toResponse(page);
    }
    async update(id, dto) {
        await this.assertExists(id);
        const page = await this.prisma.wikiPage.update({
            where: { id },
            data: {
                ...(dto.titel ? { titel: dto.titel } : {}),
                ...(dto.kategorie !== undefined ? { kategorie: dto.kategorie } : {}),
                ...(dto.inhaltMarkdown ? { inhaltMarkdown: dto.inhaltMarkdown } : {}),
            },
        });
        return this.toResponse(page);
    }
    async remove(id) {
        await this.assertExists(id);
        await this.prisma.wikiPage.delete({ where: { id } });
    }
    async getById(id) {
        const page = await this.prisma.wikiPage.findUnique({ where: { id } });
        if (!page) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.WIKI_PAGE_NOT_FOUND,
                message: `Wiki-Seite ${id} nicht gefunden`,
            });
        }
        return this.toResponse(page);
    }
    async assertExists(id) {
        const page = await this.prisma.wikiPage.findUnique({ where: { id } });
        if (!page) {
            throw new NotFoundException({
                errorCode: ERROR_CODES.WIKI_PAGE_NOT_FOUND,
                message: `Wiki-Seite ${id} nicht gefunden`,
            });
        }
    }
    toResponse(p) {
        return {
            id: p.id,
            titel: p.titel,
            slug: p.slug,
            kategorie: p.kategorie,
            inhaltMarkdown: p.inhaltMarkdown,
        };
    }
};
WikiService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], WikiService);
export { WikiService };
//# sourceMappingURL=wiki.service.js.map