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
import { IsOptional, IsString, IsArray } from 'class-validator';
export class CreateAusbildungsnachweisDto {
    titel;
    inhaltMarkdown;
    beruf;
    rahmenlehrplanId;
    anhaenge;
}
__decorate([
    ApiProperty({ example: 'Zwischenzeugnis - Q2' }),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'Der Azubi hat folgende Leistungen erbracht...' }),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ required: false, example: 'systemintegration' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateAusbildungsnachweisDto.prototype, "rahmenlehrplanId", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], CreateAusbildungsnachweisDto.prototype, "anhaenge", void 0);
export class AusbildungsnachweisResponseDto {
    id;
    azubiId;
    beruf;
    titel;
    inhaltMarkdown;
    status;
    signiertVon;
    signiertAm;
    archiviertAm;
    rahmenlehrplanId;
    erstelltAm;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ required: false, example: 'systemintegration' }),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty({ example: 'Zwischenzeugnis - Q2' }),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'Der Azubi hat folgende Leistungen erbracht...' }),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ example: 'entwurf' }),
    __metadata("design:type", String)
], AusbildungsnachweisResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "signiertVon", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "signiertAm", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "archiviertAm", void 0);
__decorate([
    ApiProperty({ required: false }),
    __metadata("design:type", Object)
], AusbildungsnachweisResponseDto.prototype, "rahmenlehrplanId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AusbildungsnachweisResponseDto.prototype, "erstelltAm", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AusbildungsnachweisResponseDto.prototype, "updatedAt", void 0);
export class UpdateAusbildungsnachweisDto extends PartialType(CreateAusbildungsnachweisDto) {
}
export class AddCommentDto {
    text;
    art;
}
__decorate([
    ApiProperty({ example: 'Gut dokumentiert' }),
    IsString(),
    __metadata("design:type", String)
], AddCommentDto.prototype, "text", void 0);
__decorate([
    ApiProperty({ required: false, example: 'allgemein' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], AddCommentDto.prototype, "art", void 0);
export class AddVersionDto {
    inhaltMarkdown;
    status;
}
__decorate([
    ApiProperty({ example: 'entwurf' }),
    IsString(),
    __metadata("design:type", String)
], AddVersionDto.prototype, "inhaltMarkdown", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], AddVersionDto.prototype, "status", void 0);
//# sourceMappingURL=ausbildungsnachweis.dto.js.map