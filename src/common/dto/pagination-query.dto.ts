import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({ description: 'Filter by azubi UUID' })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiPropertyOptional({ description: 'Filter by year (e.g., 2026)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  jahr?: number;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsOptional()
  @Type(() => String)
  status?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function withPagination<T>(
  items: ReadonlyArray<T>,
  page: number,
  limit: number,
  total: number,
): { items: ReadonlyArray<T>; meta: PaginationMeta } {
  return { items, meta: buildPaginationMeta(page, limit, total) };
}
