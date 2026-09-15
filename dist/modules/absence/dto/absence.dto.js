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
import { AbwesenheitTyp, AbwesenheitQuelle } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, } from 'class-validator';
export class CreateAbwesenheitDto {
    azubiId;
    typ;
    quelle;
    von;
    bis;
    notiz;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateAbwesenheitDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ required: true, enum: AbwesenheitTyp, example: AbwesenheitTyp.urlaub }),
    IsEnum(AbwesenheitTyp),
    __metadata("design:type", String)
], CreateAbwesenheitDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ required: false, enum: AbwesenheitQuelle }),
    IsOptional(),
    IsEnum(AbwesenheitQuelle),
    __metadata("design:type", String)
], CreateAbwesenheitDto.prototype, "quelle", void 0);
__decorate([
    ApiProperty({ required: true, example: '2026-07-01' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateAbwesenheitDto.prototype, "von", void 0);
__decorate([
    ApiProperty({ required: true, example: '2026-07-14' }),
    IsDateString(),
    __metadata("design:type", String)
], CreateAbwesenheitDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], CreateAbwesenheitDto.prototype, "notiz", void 0);
export class UpdateAbwesenheitDto {
    typ;
    von;
    bis;
    notiz;
}
__decorate([
    ApiProperty({ required: false, enum: AbwesenheitTyp }),
    IsOptional(),
    IsEnum(AbwesenheitTyp),
    __metadata("design:type", String)
], UpdateAbwesenheitDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateAbwesenheitDto.prototype, "von", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateAbwesenheitDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(500),
    __metadata("design:type", String)
], UpdateAbwesenheitDto.prototype, "notiz", void 0);
export class AbwesenheitResponseDto {
    id;
    azubiId;
    typ;
    quelle;
    von;
    bis;
    notiz;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AbwesenheitResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AbwesenheitResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ enum: AbwesenheitTyp }),
    __metadata("design:type", String)
], AbwesenheitResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ enum: AbwesenheitQuelle }),
    __metadata("design:type", String)
], AbwesenheitResponseDto.prototype, "quelle", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AbwesenheitResponseDto.prototype, "von", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AbwesenheitResponseDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AbwesenheitResponseDto.prototype, "notiz", void 0);
//# sourceMappingURL=absence.dto.js.map