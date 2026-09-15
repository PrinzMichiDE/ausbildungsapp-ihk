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
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
export var FeedbackGespraechTyp;
(function (FeedbackGespraechTyp) {
    FeedbackGespraechTyp["regelmaessig"] = "regelmaessig";
    FeedbackGespraechTyp["anlassbezogen"] = "anlassbezogen";
    FeedbackGespraechTyp["probezeit"] = "probezeit";
    FeedbackGespraechTyp["uebernahme"] = "uebernahme";
})(FeedbackGespraechTyp || (FeedbackGespraechTyp = {}));
export var FeedbackGespraechStatus;
(function (FeedbackGespraechStatus) {
    FeedbackGespraechStatus["geplant"] = "geplant";
    FeedbackGespraechStatus["durchgefuehrt"] = "durchgefuehrt";
    FeedbackGespraechStatus["dokumentiert"] = "dokumentiert";
    FeedbackGespraechStatus["nachverfolgt"] = "nachverfolgt";
})(FeedbackGespraechStatus || (FeedbackGespraechStatus = {}));
export class CreateFeedbackGespraechDto {
    azubiId;
    typ;
    termin;
    ziele;
    sichtbarkeitAzubi;
}
__decorate([
    ApiProperty(),
    IsUUID(),
    __metadata("design:type", String)
], CreateFeedbackGespraechDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ enum: FeedbackGespraechTyp }),
    IsEnum(FeedbackGespraechTyp),
    __metadata("design:type", String)
], CreateFeedbackGespraechDto.prototype, "typ", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateFeedbackGespraechDto.prototype, "termin", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateFeedbackGespraechDto.prototype, "ziele", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateFeedbackGespraechDto.prototype, "sichtbarkeitAzubi", void 0);
export class UpdateFeedbackGespraechDto {
    status;
    verlaufsnotiz;
    ziele;
    durchgefuehrtAm;
    sichtbarkeitAzubi;
}
__decorate([
    ApiPropertyOptional({ enum: FeedbackGespraechStatus }),
    IsOptional(),
    IsEnum(FeedbackGespraechStatus),
    __metadata("design:type", String)
], UpdateFeedbackGespraechDto.prototype, "status", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateFeedbackGespraechDto.prototype, "verlaufsnotiz", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateFeedbackGespraechDto.prototype, "ziele", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], UpdateFeedbackGespraechDto.prototype, "durchgefuehrtAm", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateFeedbackGespraechDto.prototype, "sichtbarkeitAzubi", void 0);
export class CreateVereinbarungDto {
    text;
    faelligAm;
}
__decorate([
    ApiProperty(),
    IsString(),
    MaxLength(1000),
    __metadata("design:type", String)
], CreateVereinbarungDto.prototype, "text", void 0);
__decorate([
    ApiPropertyOptional(),
    IsOptional(),
    IsDateString(),
    __metadata("design:type", String)
], CreateVereinbarungDto.prototype, "faelligAm", void 0);
//# sourceMappingURL=feedback-gespraech.dto.js.map