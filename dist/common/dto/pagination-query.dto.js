var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
export class PaginationQueryDto {
    page = 1;
    limit = 20;
    azubiId;
    jahr;
    status;
}
__decorate([
    ApiPropertyOptional({ default: 1, minimum: 1 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "limit", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Filter by azubi UUID' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "azubiId", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Filter by year (e.g., 2026)' }),
    IsOptional(),
    Type(() => Number),
    IsInt(),
    Min(2000),
    Max(2100),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "jahr", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Filter by status' }),
    IsOptional(),
    Type(() => String),
    __metadata("design:type", String)
], PaginationQueryDto.prototype, "status", void 0);
export function buildPaginationMeta(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
    };
}
export function withPagination(items, page, limit, total) {
    return { items, meta: buildPaginationMeta(page, limit, total) };
}
//# sourceMappingURL=pagination-query.dto.js.map