export declare class PaginationQueryDto {
    page: number;
    limit: number;
    azubiId?: string;
    jahr?: number;
    status?: string;
}
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta;
export declare function withPagination<T>(items: ReadonlyArray<T>, page: number, limit: number, total: number): {
    items: ReadonlyArray<T>;
    meta: PaginationMeta;
};
