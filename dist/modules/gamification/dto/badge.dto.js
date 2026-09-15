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
export class CreateBadgeDto {
    schluessel;
    titel;
    beschreibung;
    icon;
}
__decorate([
    ApiProperty({ example: 'punktlich-berichtet' }),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "schluessel", void 0);
__decorate([
    ApiProperty({ example: 'Immer pünktlich berichtet' }),
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false, example: 'pi-check' }),
    IsOptional(),
    IsString(),
    MaxLength(50),
    __metadata("design:type", String)
], CreateBadgeDto.prototype, "icon", void 0);
export class BadgeResponseDto {
    id;
    schluessel;
    titel;
    beschreibung;
    icon;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BadgeResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BadgeResponseDto.prototype, "schluessel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BadgeResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], BadgeResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], BadgeResponseDto.prototype, "icon", void 0);
export class UserBadgeResponseDto {
    id;
    azubiId;
    earnedAt;
    badge;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UserBadgeResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UserBadgeResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], UserBadgeResponseDto.prototype, "earnedAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", BadgeResponseDto)
], UserBadgeResponseDto.prototype, "badge", void 0);
//# sourceMappingURL=badge.dto.js.map