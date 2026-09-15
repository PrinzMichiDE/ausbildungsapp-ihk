import { PrismaService } from '../../database/prisma.service.js';
import { CreateWikiPageDto, UpdateWikiPageDto, WikiPageResponseDto } from './dto/wiki.dto.js';
export declare class WikiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateWikiPageDto): Promise<WikiPageResponseDto>;
    findAll(): Promise<WikiPageResponseDto[]>;
    findBySlug(slug: string): Promise<WikiPageResponseDto>;
    update(id: string, dto: UpdateWikiPageDto): Promise<WikiPageResponseDto>;
    remove(id: string): Promise<void>;
    getById(id: string): Promise<WikiPageResponseDto>;
    private assertExists;
    private toResponse;
}
