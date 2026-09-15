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
import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart } from '@prisma/client';
export class CreateGradeDto {
    azubiId;
    fach;
    note;
    zeitraum;
    halbjahr;
    datum;
    pruefungsart;
    gewichtung;
    gewichtungsKategorie;
    typ;
    beschreibung;
    bemerkungen;
    prueferId;
    pruefungsdatum;
    wiederholung;
    maßnahme;
    zeugnisUrl;
    quellenUrl;
    kursId;
}
__decorate([
    ApiProperty({ required: false, description: 'Azubi-ID (optional, defaults to current user)' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ example: 'Mathematik' }),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "fach", void 0);
__decorate([
    ApiProperty({ example: 2.3, minimum: 1, maximum: 6 }),
    IsNumber({ maxDecimalPlaces: 1 }),
    Min(1),
    Max(6),
    __metadata("design:type", Number)
], CreateGradeDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ example: '2026/2027 (1. Halbjahr)' }),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty({ required: false, enum: Halbjahr }),
    IsOptional(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ required: false, type: Date }),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGradeDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ required: false, enum: Pruefungsart }),
    IsOptional(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty({ required: false, example: 1.0, minimum: 0.1 }),
    IsOptional(),
    IsNumber(),
    Min(0.1),
    __metadata("design:type", Number)
], CreateGradeDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ required: false, enum: Gewichtungskategorie }),
    IsOptional(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "gewichtungsKategorie", void 0);
__decorate([
    ApiProperty({ required: false, enum: GradeTyp, default: GradeTyp.note }),
    IsOptional(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "bemerkungen", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "prueferId", void 0);
__decorate([
    ApiProperty({ required: false, type: Date }),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGradeDto.prototype, "pruefungsdatum", void 0);
__decorate([
    ApiProperty({ required: false, default: false }),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateGradeDto.prototype, "wiederholung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "ma\u00DFnahme", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "zeugnisUrl", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "quellenUrl", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateGradeDto.prototype, "kursId", void 0);
export class UpdateGradeDto {
    fach;
    note;
    zeitraum;
    halbjahr;
    datum;
    pruefungsart;
    gewichtung;
    gewichtungsKategorie;
    typ;
    beschreibung;
    bemerkungen;
    prueferId;
    pruefungsdatum;
    wiederholung;
    maßnahme;
    zeugnisUrl;
    quellenUrl;
    kursId;
    status;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "fach", void 0);
__decorate([
    ApiProperty({ required: false, minimum: 1, maximum: 6 }),
    IsOptional(),
    IsNumber({ maxDecimalPlaces: 1 }),
    Min(1),
    Max(6),
    __metadata("design:type", Number)
], UpdateGradeDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty({ required: false, enum: Halbjahr }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ required: false, type: Date }),
    IsOptional(),
    __metadata("design:type", Date)
], UpdateGradeDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ required: false, enum: Pruefungsart }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty({ required: false, minimum: 0.1 }),
    IsOptional(),
    IsNumber(),
    Min(0.1),
    __metadata("design:type", Number)
], UpdateGradeDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ required: false, enum: Gewichtungskategorie }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "gewichtungsKategorie", void 0);
__decorate([
    ApiProperty({ required: false, enum: GradeTyp }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "bemerkungen", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "prueferId", void 0);
__decorate([
    ApiProperty({ required: false, type: Date }),
    IsOptional(),
    __metadata("design:type", Date)
], UpdateGradeDto.prototype, "pruefungsdatum", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateGradeDto.prototype, "wiederholung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "ma\u00DFnahme", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "zeugnisUrl", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "quellenUrl", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "kursId", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], UpdateGradeDto.prototype, "status", void 0);
export class GradeResponseDto {
    id;
    azubiId;
    fach;
    note;
    zeitraum;
    halbjahr;
    datum;
    pruefungsart;
    gewichtung;
    gewichtungsKategorie;
    typ;
    status;
    beschreibung;
    bemerkungen;
    prueferId;
    pruefungsdatum;
    wiederholung;
    maßnahme;
    zeugnisUrl;
    quellenUrl;
    kursId;
    bewertetVon;
    bewertetAm;
    bewertung;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeResponseDto.prototype, "fach", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeResponseDto.prototype, "note", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeResponseDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty({ nullable: true, enum: Halbjahr }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ nullable: true, enum: Pruefungsart }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeResponseDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ nullable: true, enum: Gewichtungskategorie }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "gewichtungsKategorie", void 0);
__decorate([
    ApiProperty({ enum: GradeTyp }),
    __metadata("design:type", String)
], GradeResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ enum: GradeStatus }),
    __metadata("design:type", String)
], GradeResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "bemerkungen", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "prueferId", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "pruefungsdatum", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], GradeResponseDto.prototype, "wiederholung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "ma\u00DFnahme", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "zeugnisUrl", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "quellenUrl", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "kursId", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "bewertetVon", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "bewertetAm", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeResponseDto.prototype, "bewertung", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], GradeResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], GradeResponseDto.prototype, "updatedAt", void 0);
export class GradeVersionResponseDto {
    id;
    gradeId;
    version;
    fach;
    note;
    status;
    zeitraum;
    halbjahr;
    datum;
    pruefungsart;
    gewichtung;
    gewichtungsKategorie;
    typ;
    bemerkungen;
    prueferId;
    pruefungsdatum;
    wiederholung;
    maßnahme;
    zeugnisUrl;
    bewertetVon;
    bewertetAm;
    erstelltVon;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeVersionResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeVersionResponseDto.prototype, "gradeId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeVersionResponseDto.prototype, "version", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeVersionResponseDto.prototype, "fach", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeVersionResponseDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ enum: GradeStatus }),
    __metadata("design:type", String)
], GradeVersionResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeVersionResponseDto.prototype, "zeitraum", void 0);
__decorate([
    ApiProperty({ nullable: true, enum: Halbjahr }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ nullable: true, enum: Pruefungsart }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeVersionResponseDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ nullable: true, enum: Gewichtungskategorie }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "gewichtungsKategorie", void 0);
__decorate([
    ApiProperty({ enum: GradeTyp }),
    __metadata("design:type", String)
], GradeVersionResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "bemerkungen", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "prueferId", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "pruefungsdatum", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], GradeVersionResponseDto.prototype, "wiederholung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "ma\u00DFnahme", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "zeugnisUrl", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "bewertetVon", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "bewertetAm", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], GradeVersionResponseDto.prototype, "erstelltVon", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], GradeVersionResponseDto.prototype, "createdAt", void 0);
export class GradeStatusDto {
    status;
}
__decorate([
    ApiProperty({ enum: GradeStatus }),
    __metadata("design:type", String)
], GradeStatusDto.prototype, "status", void 0);
export class GradeTypDto {
    typ;
}
__decorate([
    ApiProperty({ enum: GradeTyp }),
    __metadata("design:type", String)
], GradeTypDto.prototype, "typ", void 0);
export class HalbjahrDto {
    halbjahr;
}
__decorate([
    ApiProperty({ enum: Halbjahr }),
    __metadata("design:type", String)
], HalbjahrDto.prototype, "halbjahr", void 0);
export class GewichtungskategorieDto {
    gewichtungsKategorie;
}
__decorate([
    ApiProperty({ enum: Gewichtungskategorie }),
    __metadata("design:type", String)
], GewichtungskategorieDto.prototype, "gewichtungsKategorie", void 0);
export class PruefungsartDto {
    pruefungsart;
}
__decorate([
    ApiProperty({ enum: Pruefungsart }),
    __metadata("design:type", String)
], PruefungsartDto.prototype, "pruefungsart", void 0);
//# sourceMappingURL=grade.dto.js.map