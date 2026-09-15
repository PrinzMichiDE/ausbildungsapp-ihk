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
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, Max } from 'class-validator';
export class CreateGradeEntryDto {
    azubiId;
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
    IsUUID('4'),
    __metadata("design:type", String)
], CreateGradeEntryDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ example: 'Mathematik' }),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateGradeEntryDto.prototype, "fach", void 0);
__decorate([
    ApiProperty({ required: false, enum: ['erstes', 'zweites'] }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateGradeEntryDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty({ example: 2.3, minimum: 1, maximum: 6 }),
    IsNumber({ maxDecimalPlaces: 1 }),
    Min(1),
    Max(6),
    __metadata("design:type", Number)
], CreateGradeEntryDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ required: false, type: Date }),
    IsOptional(),
    __metadata("design:type", Date)
], CreateGradeEntryDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateGradeEntryDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty({ required: false, example: 1.0 }),
    IsOptional(),
    IsNumber(),
    Min(0.1),
    __metadata("design:type", Number)
], CreateGradeEntryDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateGradeEntryDto.prototype, "zeugnisUrl", void 0);
export class GradeEntryResponseDto {
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
], GradeEntryResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeEntryResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], GradeEntryResponseDto.prototype, "fach", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], GradeEntryResponseDto.prototype, "halbjahr", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeEntryResponseDto.prototype, "note", void 0);
__decorate([
    ApiProperty({ nullable: true, type: Date }),
    __metadata("design:type", Object)
], GradeEntryResponseDto.prototype, "datum", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeEntryResponseDto.prototype, "pruefungsart", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], GradeEntryResponseDto.prototype, "gewichtung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], GradeEntryResponseDto.prototype, "zeugnisUrl", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], GradeEntryResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=grade-entry.dto.js.map