export declare class CreateWikiPageDto {
    titel: string;
    slug: string;
    kategorie?: string;
    inhaltMarkdown: string;
}
export declare class UpdateWikiPageDto {
    titel?: string;
    kategorie?: string;
    inhaltMarkdown?: string;
}
export declare class WikiPageResponseDto {
    id: string;
    titel: string;
    slug: string;
    kategorie: string | null;
    inhaltMarkdown: string;
}
