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
import { IsOptional, IsString, MaxLength, MinLength, } from 'class-validator';
export class CreateAbteilungDto {
    name;
    kurzzeichen;
    beschreibung;
}
__decorate([
    ApiProperty({ example: 'Systemintegration' }),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], CreateAbteilungDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ required: false, example: 'SI' }),
    IsOptional(),
    IsString(),
    MaxLength(20),
    __metadata("design:type", String)
], CreateAbteilungDto.prototype, "kurzzeichen", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateAbteilungDto.prototype, "beschreibung", void 0);
export class UpdateAbteilungDto {
    name;
    kurzzeichen;
    beschreibung;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MinLength(2),
    MaxLength(100),
    __metadata("design:type", String)
], UpdateAbteilungDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateAbteilungDto.prototype, "kurzzeichen", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateAbteilungDto.prototype, "beschreibung", void 0);
export class AbteilungResponseDto {
    id;
    name;
    kurzzeichen;
    beschreibung;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AbteilungResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AbteilungResponseDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AbteilungResponseDto.prototype, "kurzzeichen", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AbteilungResponseDto.prototype, "beschreibung", void 0);
//# sourceMappingURL=abteilung.dto.js.map