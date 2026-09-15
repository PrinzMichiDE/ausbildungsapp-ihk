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
import { IsDateString, IsInt, IsOptional, IsUUID, Max, Min, } from 'class-validator';
export class CreateEinsatzDto {
    azubiId;
    abteilungId;
    von;
    bis;
    skillLevel;
}
__decorate([
    ApiProperty(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateEinsatzDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateEinsatzDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty({ example: '2026-03-01' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateEinsatzDto.prototype, "von", void 0);
__decorate([
    ApiProperty({ example: '2026-08-31' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateEinsatzDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ required: false, example: 1, minimum: 0, maximum: 5 }),
    IsOptional(),
    IsInt(),
    Min(0),
    Max(5),
    __metadata("design:type", Number)
], CreateEinsatzDto.prototype, "skillLevel", void 0);
export class UpdateEinsatzDto {
    abteilungId;
    von;
    bis;
    skillLevel;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], UpdateEinsatzDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateEinsatzDto.prototype, "von", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateEinsatzDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsInt(),
    Min(0),
    Max(5),
    __metadata("design:type", Number)
], UpdateEinsatzDto.prototype, "skillLevel", void 0);
export class EinsatzResponseDto {
    id;
    azubiId;
    abteilungId;
    von;
    bis;
    skillLevel;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzResponseDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], EinsatzResponseDto.prototype, "von", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], EinsatzResponseDto.prototype, "bis", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], EinsatzResponseDto.prototype, "skillLevel", void 0);
//# sourceMappingURL=assignments.dto.js.map