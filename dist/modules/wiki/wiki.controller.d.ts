import { WikiService } from './wiki.service.js';
import { CreateWikiPageDto, UpdateWikiPageDto, WikiPageResponseDto } from './dto/wiki.dto.js';
export declare class WikiController {
    private readonly service;
    constructor(service: WikiService);
    create(dto: CreateWikiPageDto): Promise<WikiPageResponseDto>;
    findAll(): Promise<WikiPageResponseDto[]>;
    findBySlug(slug: string): Promise<WikiPageResponseDto>;
    findOne(id: string): Promise<WikiPageResponseDto>;
    update(id: string, dto: UpdateWikiPageDto): Promise<WikiPageResponseDto>;
    remove(id: string): Promise<void>;
}
