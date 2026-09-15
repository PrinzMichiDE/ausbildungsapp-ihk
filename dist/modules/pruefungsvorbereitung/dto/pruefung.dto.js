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
import { IsOptional, IsString, IsNumber, IsArray, MinLength } from 'class-validator';
export class CreatePruefungssimulationDto {
    beruf;
    typ;
    aufgaben;
    loesungen;
    bewertung;
}
__decorate([
    ApiProperty({ example: 'Systemintegration' }),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreatePruefungssimulationDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty({ example: 'schriftlich' }),
    IsString(),
    __metadata("design:type", String)
], CreatePruefungssimulationDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ isArray: true, example: ['Aufgabe 1...', 'Aufgabe 2...'] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreatePruefungssimulationDto.prototype, "aufgaben", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true, example: ['Lösung 1...', 'Lösung 2...'] }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreatePruefungssimulationDto.prototype, "loesungen", void 0);
__decorate([
    ApiProperty({ required: false, example: 100 }),
    IsOptional(),
    IsNumber(),
    __metadata("design:type", Number)
], CreatePruefungssimulationDto.prototype, "bewertung", void 0);
export class PruefungssimulationResponseDto {
    id;
    beruf;
    typ;
    aufgaben;
    loesungen;
    bewertung;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungssimulationResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungssimulationResponseDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], PruefungssimulationResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ isArray: true }),
    __metadata("design:type", Array)
], PruefungssimulationResponseDto.prototype, "aufgaben", void 0);
__decorate([
    ApiProperty({ nullable: true, isArray: true }),
    __metadata("design:type", Object)
], PruefungssimulationResponseDto.prototype, "loesungen", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], PruefungssimulationResponseDto.prototype, "bewertung", void 0);
//# sourceMappingURL=pruefung.dto.js.map