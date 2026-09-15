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
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';
import { Ausbildungsberuf, AusbildungsplanStatus } from '@prisma/client';
export class CreateAusbildungsplanDto {
    beruf;
    jahr;
    inhalte;
    anhangUrl;
}
__decorate([
    ApiProperty({ example: 'systemintegration' }),
    __metadata("design:type", String)
], CreateAusbildungsplanDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty({ example: 2026 }),
    IsNumber(),
    __metadata("design:type", Number)
], CreateAusbildungsplanDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    __metadata("design:type", Object)
], CreateAusbildungsplanDto.prototype, "inhalte", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    __metadata("design:type", String)
], CreateAusbildungsplanDto.prototype, "anhangUrl", void 0);
export class AusbildungsplanResponseDto {
    id;
    azubiId;
    ausbilderId;
    beruf;
    jahr;
    inhalte;
    status;
    anhangUrl;
    gueltigVon;
    gueltigBis;
    geprueftVon;
    geprueftAm;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "ausbilderId", void 0);
__decorate([
    ApiProperty({ example: 'systemintegration' }),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], AusbildungsplanResponseDto.prototype, "jahr", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Object)
], AusbildungsplanResponseDto.prototype, "inhalte", void 0);
__decorate([
    ApiProperty({ example: 'entwurf' }),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "anhangUrl", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Date)
], AusbildungsplanResponseDto.prototype, "gueltigVon", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Date)
], AusbildungsplanResponseDto.prototype, "gueltigBis", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", String)
], AusbildungsplanResponseDto.prototype, "geprueftVon", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Date)
], AusbildungsplanResponseDto.prototype, "geprueftAm", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AusbildungsplanResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AusbildungsplanResponseDto.prototype, "updatedAt", void 0);
export class UpdateAusbildungsplanDto extends PartialType(CreateAusbildungsplanDto) {
}
//# sourceMappingURL=ausbildungsplan.dto.js.map