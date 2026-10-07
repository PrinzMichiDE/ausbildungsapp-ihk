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
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
export class AzubiAkteResponseDto {
    id;
    name;
    email;
    beruf;
    vertragsStart;
    vertragsEnde;
    planStatus;
    nachweiseCount;
    einsaetzeCount;
    abwesenheitenCount;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AzubiAkteResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ example: 'Max Mustermann' }),
    __metadata("design:type", String)
], AzubiAkteResponseDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ example: 'max.mustermann@nextgen.de' }),
    __metadata("design:type", String)
], AzubiAkteResponseDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ required: false, example: 'systemintegration' }),
    __metadata("design:type", String)
], AzubiAkteResponseDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty({ required: false, example: '2026-09-01' }),
    IsOptional(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], AzubiAkteResponseDto.prototype, "vertragsStart", void 0);
__decorate([
    ApiProperty({ required: false, example: '2029-08-31' }),
    IsOptional(),
    IsDate(),
    Type(() => Date),
    __metadata("design:type", Date)
], AzubiAkteResponseDto.prototype, "vertragsEnde", void 0);
__decorate([
    ApiProperty({ required: false, example: 'entwurf' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], AzubiAkteResponseDto.prototype, "planStatus", void 0);
__decorate([
    ApiProperty({ required: false, example: 3 }),
    IsOptional(),
    __metadata("design:type", Number)
], AzubiAkteResponseDto.prototype, "nachweiseCount", void 0);
__decorate([
    ApiProperty({ required: false, example: 5 }),
    IsOptional(),
    __metadata("design:type", Number)
], AzubiAkteResponseDto.prototype, "einsaetzeCount", void 0);
__decorate([
    ApiProperty({ required: false, example: 2 }),
    IsOptional(),
    __metadata("design:type", Number)
], AzubiAkteResponseDto.prototype, "abwesenheitenCount", void 0);
export class AzubiAkteOverviewDto {
    totalAzubis;
    aktiveVertraege;
    gesamtNachweise;
    inPruefung;
}
__decorate([
    ApiProperty({ example: 42 }),
    __metadata("design:type", Number)
], AzubiAkteOverviewDto.prototype, "totalAzubis", void 0);
__decorate([
    ApiProperty({ example: 15 }),
    __metadata("design:type", Number)
], AzubiAkteOverviewDto.prototype, "aktiveVertraege", void 0);
__decorate([
    ApiProperty({ example: 120 }),
    __metadata("design:type", Number)
], AzubiAkteOverviewDto.prototype, "gesamtNachweise", void 0);
__decorate([
    ApiProperty({ example: 8 }),
    __metadata("design:type", Number)
], AzubiAkteOverviewDto.prototype, "inPruefung", void 0);
//# sourceMappingURL=azubi-akte.dto.js.map