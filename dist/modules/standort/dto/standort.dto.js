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
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
export class CreateStandortDto {
    name;
    adresse;
    plz;
    ort;
}
__decorate([
    ApiProperty({ example: 'Zentrale Ausbildungsstätte' }),
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], CreateStandortDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Musterstraße 1' }),
    IsOptional(),
    IsString(),
    MaxLength(200),
    __metadata("design:type", String)
], CreateStandortDto.prototype, "adresse", void 0);
__decorate([
    ApiProperty({ required: false, example: '10115' }),
    IsOptional(),
    IsString(),
    MaxLength(10),
    __metadata("design:type", String)
], CreateStandortDto.prototype, "plz", void 0);
__decorate([
    ApiProperty({ required: false, example: 'Berlin' }),
    IsOptional(),
    IsString(),
    MaxLength(100),
    __metadata("design:type", String)
], CreateStandortDto.prototype, "ort", void 0);
export class StandortResponseDto {
    id;
    name;
    adresse;
    plz;
    ort;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], StandortResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], StandortResponseDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], StandortResponseDto.prototype, "adresse", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], StandortResponseDto.prototype, "plz", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], StandortResponseDto.prototype, "ort", void 0);
export class UpdateStandortDto extends PartialType(CreateStandortDto) {
}
//# sourceMappingURL=standort.dto.js.map