var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID, } from 'class-validator';
import { ConsentAction, DatenschutzRequestStatus, DatenschutzRequestTyp, DpiaRisk, DpiaStatus, LegalBasisArticle, } from '@prisma/client';
export class CreateDatenschutzRequestDto {
    typ;
    azubiId;
    details;
}
__decorate([
    ApiProperty({ enum: DatenschutzRequestTyp }),
    IsEnum(DatenschutzRequestTyp),
    __metadata("design:type", String)
], CreateDatenschutzRequestDto.prototype, "typ", void 0);
__decorate([
    ApiPropertyOptional({
        description: 'Nur für Ausbilder/HR/Admin: Ziel-Azubi, sonst selbst',
    }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateDatenschutzRequestDto.prototype, "azubiId", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateDatenschutzRequestDto.prototype, "details", void 0);
export class ProcessDatenschutzRequestDto {
    status;
    result;
}
__decorate([
    ApiProperty({ enum: DatenschutzRequestStatus }),
    IsEnum(DatenschutzRequestStatus),
    __metadata("design:type", String)
], ProcessDatenschutzRequestDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ProcessDatenschutzRequestDto.prototype, "result", void 0);
export class DatenschutzRequestResponseDto {
    id;
    userId;
    typ;
    status;
    details;
    requestedAt;
    dueDate;
    completedAt;
    result;
    processedBy;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], DatenschutzRequestResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], DatenschutzRequestResponseDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ enum: DatenschutzRequestTyp }),
    __metadata("design:type", String)
], DatenschutzRequestResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ enum: DatenschutzRequestStatus }),
    __metadata("design:type", String)
], DatenschutzRequestResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DatenschutzRequestResponseDto.prototype, "details", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], DatenschutzRequestResponseDto.prototype, "requestedAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DatenschutzRequestResponseDto.prototype, "dueDate", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DatenschutzRequestResponseDto.prototype, "completedAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DatenschutzRequestResponseDto.prototype, "result", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DatenschutzRequestResponseDto.prototype, "processedBy", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], DatenschutzRequestResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], DatenschutzRequestResponseDto.prototype, "updatedAt", void 0);
export class ConsentGrantDto {
    key;
    version;
    text;
    source;
}
__decorate([
    ApiProperty({ example: 'gamification' }),
    IsString(),
    __metadata("design:type", String)
], ConsentGrantDto.prototype, "key", void 0);
__decorate([
    ApiPropertyOptional({ default: '1' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ConsentGrantDto.prototype, "version", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ConsentGrantDto.prototype, "text", void 0);
__decorate([
    ApiPropertyOptional({ default: 'ui' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ConsentGrantDto.prototype, "source", void 0);
export class ConsentRevokeDto {
    version;
}
__decorate([
    ApiPropertyOptional({ default: '1' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], ConsentRevokeDto.prototype, "version", void 0);
export class ConsentResponseDto {
    id;
    userId;
    key;
    version;
    text;
    grantedAt;
    revokedAt;
    ipAddress;
    source;
    active;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentResponseDto.prototype, "userId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentResponseDto.prototype, "key", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentResponseDto.prototype, "version", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentResponseDto.prototype, "text", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ConsentResponseDto.prototype, "grantedAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentResponseDto.prototype, "revokedAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentResponseDto.prototype, "ipAddress", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentResponseDto.prototype, "source", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], ConsentResponseDto.prototype, "active", void 0);
export class ConsentLogResponseDto {
    id;
    userId;
    key;
    version;
    action;
    text;
    ipAddress;
    source;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentLogResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentLogResponseDto.prototype, "userId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentLogResponseDto.prototype, "key", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ConsentLogResponseDto.prototype, "version", void 0);
__decorate([
    ApiProperty({ enum: ConsentAction }),
    __metadata("design:type", String)
], ConsentLogResponseDto.prototype, "action", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentLogResponseDto.prototype, "text", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentLogResponseDto.prototype, "ipAddress", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ConsentLogResponseDto.prototype, "source", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ConsentLogResponseDto.prototype, "createdAt", void 0);
export class LegalBasisDto {
    title;
    purpose;
    dataCategories;
    recipients;
    retentionPeriod;
    legalBasis;
    controller;
    active;
}
__decorate([
    ApiProperty({ example: 'Ausbildungsvertrag' }),
    IsString(),
    __metadata("design:type", String)
], LegalBasisDto.prototype, "title", void 0);
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], LegalBasisDto.prototype, "purpose", void 0);
__decorate([
    ApiProperty({ type: [String] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], LegalBasisDto.prototype, "dataCategories", void 0);
__decorate([
    ApiProperty({ type: [String] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], LegalBasisDto.prototype, "recipients", void 0);
__decorate([
    ApiPropertyOptional({ example: 'Während der Ausbildung + 3 Jahre' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], LegalBasisDto.prototype, "retentionPeriod", void 0);
__decorate([
    ApiProperty({ enum: LegalBasisArticle }),
    IsEnum(LegalBasisArticle),
    __metadata("design:type", String)
], LegalBasisDto.prototype, "legalBasis", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], LegalBasisDto.prototype, "controller", void 0);
__decorate([
    ApiPropertyOptional({ default: true }),
    IsOptional(),
    __metadata("design:type", Boolean)
], LegalBasisDto.prototype, "active", void 0);
export class UpdateLegalBasisDto extends PartialType(LegalBasisDto) {
}
export class LegalBasisResponseDto {
    id;
    title;
    purpose;
    dataCategories;
    recipients;
    retentionPeriod;
    legalBasis;
    controller;
    active;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LegalBasisResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LegalBasisResponseDto.prototype, "title", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LegalBasisResponseDto.prototype, "purpose", void 0);
__decorate([
    ApiProperty({ type: [String] }),
    __metadata("design:type", Array)
], LegalBasisResponseDto.prototype, "dataCategories", void 0);
__decorate([
    ApiProperty({ type: [String] }),
    __metadata("design:type", Array)
], LegalBasisResponseDto.prototype, "recipients", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], LegalBasisResponseDto.prototype, "retentionPeriod", void 0);
__decorate([
    ApiProperty({ enum: LegalBasisArticle }),
    __metadata("design:type", String)
], LegalBasisResponseDto.prototype, "legalBasis", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], LegalBasisResponseDto.prototype, "controller", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], LegalBasisResponseDto.prototype, "active", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], LegalBasisResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], LegalBasisResponseDto.prototype, "updatedAt", void 0);
export class DpiaDto {
    title;
    description;
    riskLevel;
    measures;
    status;
    assessedAt;
}
__decorate([
    ApiProperty({ example: 'KI-Kursgenerierung (RAG)' }),
    IsString(),
    __metadata("design:type", String)
], DpiaDto.prototype, "title", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], DpiaDto.prototype, "description", void 0);
__decorate([
    ApiProperty({ enum: DpiaRisk }),
    IsEnum(DpiaRisk),
    __metadata("design:type", String)
], DpiaDto.prototype, "riskLevel", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], DpiaDto.prototype, "measures", void 0);
__decorate([
    ApiProperty({ enum: DpiaStatus }),
    IsEnum(DpiaStatus),
    __metadata("design:type", String)
], DpiaDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Wann bewertet (ISO)' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], DpiaDto.prototype, "assessedAt", void 0);
export class UpdateDpiaDto extends PartialType(DpiaDto) {
}
export class DpiaResponseDto {
    id;
    title;
    description;
    riskLevel;
    measures;
    status;
    assessedAt;
    assessedBy;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], DpiaResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], DpiaResponseDto.prototype, "title", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DpiaResponseDto.prototype, "description", void 0);
__decorate([
    ApiProperty({ enum: DpiaRisk }),
    __metadata("design:type", String)
], DpiaResponseDto.prototype, "riskLevel", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DpiaResponseDto.prototype, "measures", void 0);
__decorate([
    ApiProperty({ enum: DpiaStatus }),
    __metadata("design:type", String)
], DpiaResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DpiaResponseDto.prototype, "assessedAt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], DpiaResponseDto.prototype, "assessedBy", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], DpiaResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], DpiaResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=data-privacy.dto.js.map