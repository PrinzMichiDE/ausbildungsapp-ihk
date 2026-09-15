var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength, } from 'class-validator';
export class CreateProjektDto {
    titel;
    beschreibung;
    projektantrag;
    projektdoku;
}
__decorate([
    ApiProperty({ example: 'Abschlussprojekt: Microservices-Architektur' }),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], CreateProjektDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Entwurf eines Microservices-basierten Systems' }),
    IsOptional(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateProjektDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Der Projektantrag beschreibt ...' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProjektDto.prototype, "projektantrag", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Dokumentation des Projektergebnisses' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateProjektDto.prototype, "projektdoku", void 0);
export class UpdateProjektDto extends PartialType(CreateProjektDto) {
}
export class ProjektResponseDto {
    id;
    azubiId;
    titel;
    beschreibung;
    projektantrag;
    projektdoku;
    status;
    bewertung;
    bewertetVon;
    bewertetAm;
    freigegeben;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ProjektResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ProjektResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ProjektResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ProjektResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ProjektResponseDto.prototype, "projektantrag", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ProjektResponseDto.prototype, "projektdoku", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ProjektResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ProjektResponseDto.prototype, "bewertung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ProjektResponseDto.prototype, "bewertetVon", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], ProjektResponseDto.prototype, "bewertetAm", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], ProjektResponseDto.prototype, "freigegeben", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ProjektResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], ProjektResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=projekt.dto.js.map