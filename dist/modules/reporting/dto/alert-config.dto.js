var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsObject, IsOptional } from 'class-validator';
export var AlertTyp;
(function (AlertTyp) {
    AlertTyp["noten"] = "noten";
    AlertTyp["berichtsheft"] = "berichtsheft";
    AlertTyp["kurs"] = "kurs";
    AlertTyp["pruefung"] = "pruefung";
    AlertTyp["foerderbedarf"] = "foerderbedarf";
    AlertTyp["kapazitaet"] = "kapazitaet";
})(AlertTyp || (AlertTyp = {}));
export class CreateAlertConfigDto {
    typ;
    schwelle;
    aktiv;
}
__decorate([
    ApiProperty({ enum: AlertTyp, example: AlertTyp.noten }),
    IsEnum(AlertTyp),
    __metadata("design:type", String)
], CreateAlertConfigDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({
        example: { noteGleich4InZweiFächern: true, fehlendeBerichteSchwelle: 3, noteUnter3InEinem: true },
        description: 'Schwelle als JSON',
    }),
    IsObject(),
    __metadata("design:type", Object)
], CreateAlertConfigDto.prototype, "schwelle", void 0);
__decorate([
    ApiPropertyOptional({ default: true }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateAlertConfigDto.prototype, "aktiv", void 0);
export class UpdateAlertConfigDto {
    typ;
    schwelle;
    aktiv;
}
__decorate([
    ApiPropertyOptional({ enum: AlertTyp }),
    IsOptional(),
    IsEnum(AlertTyp),
    __metadata("design:type", String)
], UpdateAlertConfigDto.prototype, "typ", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Schwelle JSON' }),
    IsOptional(),
    IsObject(),
    __metadata("design:type", Object)
], UpdateAlertConfigDto.prototype, "schwelle", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateAlertConfigDto.prototype, "aktiv", void 0);
export class AlertConfigResponseDto {
    id;
    userId;
    typ;
    schwelle;
    aktiv;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AlertConfigResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AlertConfigResponseDto.prototype, "userId", void 0);
__decorate([
    ApiProperty({ enum: AlertTyp }),
    __metadata("design:type", String)
], AlertConfigResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ type: Object }),
    __metadata("design:type", Object)
], AlertConfigResponseDto.prototype, "schwelle", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], AlertConfigResponseDto.prototype, "aktiv", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AlertConfigResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AlertConfigResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=alert-config.dto.js.map