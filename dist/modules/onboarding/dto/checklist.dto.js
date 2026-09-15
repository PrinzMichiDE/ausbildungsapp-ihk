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
import { IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength, } from 'class-validator';
export class CreateChecklistDto {
    azubiId;
    titel;
    items;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ example: 'Erster Arbeitstag' }),
    IsString(),
    MinLength(2),
    MaxLength(200),
    __metadata("design:type", String)
], CreateChecklistDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ type: [String], example: ['Hardware ausgeben', 'Account anlegen'] }),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateChecklistDto.prototype, "items", void 0);
export class UpdateChecklistItemDto {
    erledigt;
}
__decorate([
    ApiProperty({ example: true }),
    __metadata("design:type", Boolean)
], UpdateChecklistItemDto.prototype, "erledigt", void 0);
export class ChecklistResponseDto {
    id;
    azubiId;
    titel;
    erledigt;
    items;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ChecklistResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ChecklistResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], ChecklistResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], ChecklistResponseDto.prototype, "erledigt", void 0);
__decorate([
    ApiProperty({ type: [Object] }),
    __metadata("design:type", Array)
], ChecklistResponseDto.prototype, "items", void 0);
//# sourceMappingURL=checklist.dto.js.map