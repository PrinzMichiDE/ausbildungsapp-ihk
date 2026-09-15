import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ERROR_CODES } from '../../common/constants/error-codes.js';
import {
  CreateWikiPageDto,
  UpdateWikiPageDto,
  WikiPageResponseDto,
} from './dto/wiki.dto.js';

@Injectable()
export class WikiService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateWikiPageDto): Promise<WikiPageResponseDto> {
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

  async findAll(): Promise<WikiPageResponseDto[]> {
    const pages = await this.prisma.wikiPage.findMany({
      orderBy: [{ kategorie: 'asc' }, { titel: 'asc' }],
    });
    return pages.map((p) => this.toResponse(p));
  }

  async findBySlug(slug: string): Promise<WikiPageResponseDto> {
    const page = await this.prisma.wikiPage.findUnique({ where: { slug } });
    if (!page) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.WIKI_PAGE_NOT_FOUND,
        message: `Wiki-Seite ${slug} nicht gefunden`,
      });
    }
    return this.toResponse(page);
  }

  async update(
    id: string,
    dto: UpdateWikiPageDto,
  ): Promise<WikiPageResponseDto> {
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

  async remove(id: string): Promise<void> {
    await this.assertExists(id);
    await this.prisma.wikiPage.delete({ where: { id } });
  }

  async getById(id: string): Promise<WikiPageResponseDto> {
    const page = await this.prisma.wikiPage.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.WIKI_PAGE_NOT_FOUND,
        message: `Wiki-Seite ${id} nicht gefunden`,
      });
    }
    return this.toResponse(page);
  }

  private async assertExists(id: string): Promise<void> {
    const page = await this.prisma.wikiPage.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException({
        errorCode: ERROR_CODES.WIKI_PAGE_NOT_FOUND,
        message: `Wiki-Seite ${id} nicht gefunden`,
      });
    }
  }

  private toResponse(p: {
    id: string;
    titel: string;
    slug: string;
    kategorie: string | null;
    inhaltMarkdown: string;
  }): WikiPageResponseDto {
    return {
      id: p.id,
      titel: p.titel,
      slug: p.slug,
      kategorie: p.kategorie,
      inhaltMarkdown: p.inhaltMarkdown,
    };
  }
}
