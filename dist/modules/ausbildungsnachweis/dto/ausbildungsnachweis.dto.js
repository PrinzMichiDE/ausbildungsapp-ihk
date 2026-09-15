var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength } from 'class-validator';
import { AusbildungsnachweisStatus } from '../../../common/enums/ausbildungsmanagement.enums';
export class CreateAusbildungsnachweisDto {
    azubiId;
    titel;
    inhaltMarkdown;
    rahmenlehrplanId;
    typ;
}
__decorate([
    ApiProperty({ example: 'azubi-uuid' }),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ example: 'Ausbildungsnachweis Q1 2026' }),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'Inhalt des Nachweises...' }),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ example: 'rahmenlehrplan-uuid' }),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "rahmenlehrplanId", void 0);
__decorate([
    ApiProperty({ example: 'betrieblich' }),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "typ", void 0);
export class AusbildungsnachweisResponseDto {
    id;
    azubiId;
    titel;
    inhaltMarkdown;
    rahmenlehrplanId;
    typ;
    status;
    signiertVon;
    signiertAm;
    archiviertAm;
    erstelltAm;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ example: 'azubi-uuid' }),
    IsString(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ example: 'Ausbildungsnachweis Q1 2026' }),
    IsString(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'Inhalt des Nachweises...' }),
    IsString(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ example: 'rahmenlehrplan-uuid' }),
    IsString(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "rahmenlehrplanId", void 0);
__decorate([
    ApiProperty({ example: 'betrieblich' }),
    IsString(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ enum: AusbildungsnachweisStatus }),
    IsEnum(AusbildungsnachweisStatus),
    __metadata("design:type", typeof (_a = typeof AusbildungsnachweisStatus !== "undefined" && AusbildungsnachweisStatus) === "function" ? _a : Object)
], AusbildungsnachweisResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    IsString(),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "signiertVon", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "signiertAm", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "archiviertAm", void 0);
__decorate([
    ApiProperty({ type: Date }),
    __metadata("design:type", Date)
], AusbildungsnachweisResponseDto.prototype, "erstelltAm", void 0);
__decorate([
    ApiProperty({ type: Date }),
    __metadata("design:type", Date)
], AusbildungsnachweisResponseDto.prototype, "updatedAt", void 0);
export class UpdateAusbildungsnachweisDto extends PartialType(CreateAusbildungsnachweisDto) {
}
//# sourceMappingURL=ausbildungsnachweis.dto.js.map