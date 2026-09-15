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
import { IsOptional, IsString, IsNumber, IsArray, Min, Max } from 'class-validator';
export class CreateKompetenzprofilDto {
    fachkompetenzen;
    sozialkompetenzen;
    staerken;
    schwaechen;
}
__decorate([
    ApiProperty({ isArray: true, example: ['Systemintegration', 'Netzwerktechnik'] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateKompetenzprofilDto.prototype, "fachkompetenzen", void 0);
__decorate([
    ApiProperty({ isArray: true, example: ['Kommunikation', 'Teamarbeit'] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateKompetenzprofilDto.prototype, "sozialkompetenzen", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true, example: ['Führungskompetenz'] }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateKompetenzprofilDto.prototype, "staerken", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true, example: ['Zeitmanagement'] }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateKompetenzprofilDto.prototype, "schwaechen", void 0);
export class KompetenzprofilResponseDto {
    id;
    fachkompetenzen;
    sozialkompetenzen;
    staerken;
    schwaechen;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], KompetenzprofilResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ isArray: true }),
    __metadata("design:type", Array)
], KompetenzprofilResponseDto.prototype, "fachkompetenzen", void 0);
__decorate([
    ApiProperty({ isArray: true }),
    __metadata("design:type", Array)
], KompetenzprofilResponseDto.prototype, "sozialkompetenzen", void 0);
__decorate([
    ApiProperty({ nullable: true, isArray: true }),
    __metadata("design:type", Object)
], KompetenzprofilResponseDto.prototype, "staerken", void 0);
__decorate([
    ApiProperty({ nullable: true, isArray: true }),
    __metadata("design:type", Object)
], KompetenzprofilResponseDto.prototype, "schwaechen", void 0);
export class UpdateKompetenzprofilDto extends PartialType(CreateKompetenzprofilDto) {
}
export class BewerteKompetenzDto {
    bewertung;
    kommentar;
}
__decorate([
    ApiProperty({ example: 4 }),
    IsNumber(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], BewerteKompetenzDto.prototype, "bewertung", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Sehr gute Leistung in der Systemintegration' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], BewerteKompetenzDto.prototype, "kommentar", void 0);
//# sourceMappingURL=kompetenz.dto.js.map