var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength, } from 'class-validator';
export class CreateWikiPageDto {
    titel;
    slug;
    kategorie;
    inhaltMarkdown;
}
__decorate([
    ApiProperty({ example: 'Erste Schritte im Berichtsheft' }),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], CreateWikiPageDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'erste-schritte-berichtsheft' }),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], CreateWikiPageDto.prototype, "slug", void 0);
__decorate([
    ApiProperty({ required: false, example: 'How-To' }),
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateWikiPageDto.prototype, "kategorie", void 0);
__decorate([
    ApiProperty({ description: 'Markdown' }),
    IsString(),
    MinLength(1),
    __metadata("design:type", String)
], CreateWikiPageDto.prototype, "inhaltMarkdown", void 0);
export class UpdateWikiPageDto {
    titel;
    kategorie;
    inhaltMarkdown;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateWikiPageDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateWikiPageDto.prototype, "kategorie", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateWikiPageDto.prototype, "inhaltMarkdown", void 0);
export class WikiPageResponseDto {
    id;
    titel;
    slug;
    kategorie;
    inhaltMarkdown;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], WikiPageResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], WikiPageResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], WikiPageResponseDto.prototype, "slug", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], WikiPageResponseDto.prototype, "kategorie", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], WikiPageResponseDto.prototype, "inhaltMarkdown", void 0);
//# sourceMappingURL=wiki.dto.js.map