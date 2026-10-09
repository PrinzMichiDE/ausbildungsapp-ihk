var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsUUID, IsDate, IsOptional, IsEnum, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export var EinsatzStatus;
(function (EinsatzStatus) {
    EinsatzStatus["GEPLANT"] = "geplant";
    EinsatzStatus["BESTATIGT"] = "bestatigt";
    EinsatzStatus["ABGESCHLOSSEN"] = "abgeschlossen";
    EinsatzStatus["STORNIERT"] = "storniert";
})(EinsatzStatus || (EinsatzStatus = {}));
export class CreateEinsatzPlanungDto {
    azubiId;
    abteilungId;
    von;
    bis;
    beschreibung;
    status;
    kommentar;
}
__decorate([
    ApiProperty(),
    IsUUID(),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    IsUUID(),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], CreateEinsatzPlanungDto.prototype, "von", void 0);
__decorate([
    ApiProperty(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], CreateEinsatzPlanungDto.prototype, "bis", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "beschreibung", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsEnum(EinsatzStatus),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "kommentar", void 0);
export class UpdateEinsatzPlanungDto {
    azubiId;
    abteilungId;
    von;
    bis;
    beschreibung;
    status;
    kommentar;
}
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], UpdateEinsatzPlanungDto.prototype, "azubiId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], UpdateEinsatzPlanungDto.prototype, "abteilungId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], UpdateEinsatzPlanungDto.prototype, "von", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], UpdateEinsatzPlanungDto.prototype, "bis", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateEinsatzPlanungDto.prototype, "beschreibung", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsEnum(EinsatzStatus),
    __metadata("design:type", String)
], UpdateEinsatzPlanungDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateEinsatzPlanungDto.prototype, "kommentar", void 0);
export class EinsatzPlanungQueryDto {
    azubiId;
    abteilungId;
    status;
    von;
    bis;
    page = 1;
    limit = 20;
}
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], EinsatzPlanungQueryDto.prototype, "azubiId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsUUID(),
    __metadata("design:type", String)
], EinsatzPlanungQueryDto.prototype, "abteilungId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsEnum(EinsatzStatus),
    __metadata("design:type", String)
], EinsatzPlanungQueryDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], EinsatzPlanungQueryDto.prototype, "von", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], EinsatzPlanungQueryDto.prototype, "bis", void 0);
__decorate([
    ApiPropertyOptional({ default: 1 }),
    IsOptional(),
    IsNumber(),
    Min(1),
    __metadata("design:type", Number)
], EinsatzPlanungQueryDto.prototype, "page", void 0);
__decorate([
    ApiPropertyOptional({ default: 20 }),
    IsOptional(),
    IsNumber(),
    Min(1),
    Max(100),
    __metadata("design:type", Number)
], EinsatzPlanungQueryDto.prototype, "limit", void 0);
export class EinsatzPlanungResponseDto {
    id;
    azubiId;
    abteilungId;
    von;
    bis;
    beschreibung;
    status;
    kommentar;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], EinsatzPlanungResponseDto.prototype, "von", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], EinsatzPlanungResponseDto.prototype, "bis", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "kommentar", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], EinsatzPlanungResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], EinsatzPlanungResponseDto.prototype, "updatedAt", void 0);
export class EinsatzUserAssignmentDto {
    azubiId;
}
__decorate([
    ApiProperty(),
    IsUUID(),
    __metadata("design:type", String)
], EinsatzUserAssignmentDto.prototype, "azubiId", void 0);
//# sourceMappingURL=einsatzplanung.dto.js.map