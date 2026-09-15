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
import { IsOptional, IsString } from 'class-validator';
import { IsDateString } from 'class-validator';
export class CreatePruefungDto {
    beschreibung;
    ihkTermin;
}
__decorate([
    ApiProperty({ example: 'AP2 - Abschlussprüfung Teil 2' }),
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePruefungDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ example: '2026-06-15', description: 'IHK-Termin' }),
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreatePruefungDto.prototype, "ihkTermin", void 0);
export class UpdatePruefungDto extends PartialType(CreatePruefungDto) {
}
export class PruefungResponseDto {
    id;
    azubiId;
    typ;
    status;
    beschreibung;
    ihkTermin;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], PruefungResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], PruefungResponseDto.prototype, "ihkTermin", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], PruefungResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], PruefungResponseDto.prototype, "updatedAt", void 0);
export class CreateMeilensteinDto {
    titel;
    beschreibung;
    faelligAm;
}
__decorate([
    ApiProperty({ example: 'Antrag einreichen' }),
    IsString(),
    __metadata("design:type", String)
], CreateMeilensteinDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateMeilensteinDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false, example: '2026-05-01' }),
    IsDateString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateMeilensteinDto.prototype, "faelligAm", void 0);
export class UpdateMeilensteinDto extends PartialType(CreateMeilensteinDto) {
}
export class PruefungsMeilensteinResponseDto {
    id;
    pruefungId;
    titel;
    beschreibung;
    faelligAm;
    erledigt;
    erledigtAm;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungsMeilensteinResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungsMeilensteinResponseDto.prototype, "pruefungId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungsMeilensteinResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], PruefungsMeilensteinResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], PruefungsMeilensteinResponseDto.prototype, "faelligAm", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], PruefungsMeilensteinResponseDto.prototype, "erledigt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], PruefungsMeilensteinResponseDto.prototype, "erledigtAm", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], PruefungsMeilensteinResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], PruefungsMeilensteinResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=exams.dto.js.map