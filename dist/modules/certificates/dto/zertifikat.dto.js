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
import { IsDateString, IsOptional, IsString, IsUUID, MaxLength, MinLength, } from 'class-validator';
export class CreateZertifikatDto {
    azubiId;
    titel;
    aussteller;
    erworbenAm;
    dokumentUrl;
}
__decorate([
    ApiProperty({ required: false, description: 'Nur für HR/Ausbilder' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateZertifikatDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ example: 'AWS Certified Cloud Practitioner' }),
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], CreateZertifikatDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'Amazon Web Services' }),
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], CreateZertifikatDto.prototype, "aussteller", void 0);
__decorate([
    ApiProperty({ example: '2026-05-12' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateZertifikatDto.prototype, "erworbenAm", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateZertifikatDto.prototype, "dokumentUrl", void 0);
export class UpdateZertifikatDto {
    titel;
    aussteller;
    erworbenAm;
    dokumentUrl;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateZertifikatDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateZertifikatDto.prototype, "aussteller", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateZertifikatDto.prototype, "erworbenAm", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateZertifikatDto.prototype, "dokumentUrl", void 0);
export class ZertifikatResponseDto {
    id;
    azubiId;
    titel;
    aussteller;
    erworbenAm;
    dokumentUrl;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ZertifikatResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ZertifikatResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ZertifikatResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ZertifikatResponseDto.prototype, "aussteller", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ZertifikatResponseDto.prototype, "erworbenAm", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ZertifikatResponseDto.prototype, "dokumentUrl", void 0);
//# sourceMappingURL=zertifikat.dto.js.map