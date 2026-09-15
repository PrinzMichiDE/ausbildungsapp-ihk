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
import { IsNumber, IsOptional, IsString, IsEnum, MaxLength, Min, Max } from 'class-validator';
import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart } from '@prisma/client';
export class GradeStatusDto {
    status;
}
__decorate([
    ApiProperty({ enum: GradeStatus }),
    IsEnum(GradeStatus),
    __metadata("design:type", String)
], GradeStatusDto.prototype, "status", void 0);
export class GradeTypDto {
    typ;
}
__decorate([
    ApiProperty({ enum: GradeTyp }),
    IsEnum(GradeTyp),
    __metadata("design:type", String)
], GradeTypDto.prototype, "typ", void 0);
export class HalbjahrDto {
    halbjahr;
}
__decorate([
    ApiProperty({ enum: Halbjahr }),
    IsEnum(Halbjahr),
    __metadata("design:type", String)
], HalbjahrDto.prototype, "halbjahr", void 0);
export class GewichtungskategorieDto {
    gewichtungsKategorie;
}
__decorate([
    ApiProperty({ enum: Gewichtungskategorie }),
    IsEnum(Gewichtungskategorie),
    __metadata("design:type", String)
], GewichtungskategorieDto.prototype, "gewichtungsKategorie", void 0);
export class PruefungsartDto {
    pruefungsart;
}
__decorate([
    ApiProperty({ enum: Pruefungsart }),
    IsEnum(Pruefungsart),
    __metadata("design:type", String)
], PruefungsartDto.prototype, "pruefungsart", void 0);
export class UpdateGradeEntryDto {
    fach;
    halbjahr;
    note;
    datum;
    pruefungsart;
    gewichtung;
    zeugnisUrl;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateGradeEntryDto.prototype, "fach", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeEntryDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ required: false, minimum: 1, maximum: 6 }),
    IsOptional(),
    IsNumber({ maxDecimalPlaces: 1 }),
    Min(1),
    Max(6),
    __metadata("design:type", Number)
], UpdateGradeEntryDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ required: false, type: Date }),
    IsOptional(),
    __metadata("design:type", Date)
], UpdateGradeEntryDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeEntryDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsNumber(),
    Min(0.1),
    __metadata("design:type", Number)
], UpdateGradeEntryDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeEntryDto.prototype, "zeugnisUrl", void 0);
export class UpdateGradeEntryResponseDto {
    id;
    azubiId;
    fach;
    halbjahr;
    note;
    datum;
    pruefungsart;
    gewichtung;
    zeugnisUrl;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UpdateGradeEntryResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UpdateGradeEntryResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UpdateGradeEntryResponseDto.prototype, "fach", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], UpdateGradeEntryResponseDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], UpdateGradeEntryResponseDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], UpdateGradeEntryResponseDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], UpdateGradeEntryResponseDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], UpdateGradeEntryResponseDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], UpdateGradeEntryResponseDto.prototype, "zeugnisUrl", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], UpdateGradeEntryResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=grade.dto.js.map