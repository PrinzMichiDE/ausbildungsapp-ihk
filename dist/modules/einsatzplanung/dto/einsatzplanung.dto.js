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
import { IsOptional, IsString, IsNumber, IsUUID, MinLength, Min, Max } from 'class-validator';
export class CreateEinsatzPlanungDto {
    beruf;
    abteilungId;
    von;
    bis;
    skillLevel;
}
__decorate([
    ApiProperty({ example: 'Systemintegration' }),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty({ example: 'abteilung-uuid' }),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateEinsatzPlanungDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty({ example: '2026-01-01' }),
    __metadata("design:type", Date)
], CreateEinsatzPlanungDto.prototype, "von", void 0);
__decorate([
    ApiProperty({ example: '2026-06-30' }),
    __metadata("design:type", Date)
], CreateEinsatzPlanungDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ required: false, example: 3, minimum: 1, maximum: 5 }),
    IsOptional(),
    IsNumber(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], CreateEinsatzPlanungDto.prototype, "skillLevel", void 0);
export class EinsatzPlanungResponseDto {
    id;
    beruf;
    abteilungId;
    von;
    bis;
    skillLevel;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], EinsatzPlanungResponseDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty({ type: Date }),
    __metadata("design:type", Date)
], EinsatzPlanungResponseDto.prototype, "von", void 0);
__decorate([
    ApiProperty({ type: Date }),
    __metadata("design:type", Date)
], EinsatzPlanungResponseDto.prototype, "bis", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], EinsatzPlanungResponseDto.prototype, "skillLevel", void 0);
//# sourceMappingURL=einsatzplanung.dto.js.map