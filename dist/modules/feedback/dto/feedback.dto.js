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
import { FeedbackTyp } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min, } from 'class-validator';
export class CreateFeedbackDto {
    typ;
    anUserId;
    abteilungId;
    fachkompetenz;
    softskills;
    kommentar;
}
__decorate([
    ApiProperty({ enum: FeedbackTyp, example: FeedbackTyp.azubi_feedback }),
    IsEnum(FeedbackTyp),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ required: false, description: 'Bewerteter Auszubildende' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "anUserId", void 0);
__decorate([
    ApiProperty({ required: false, description: 'Bewertete Abteilung' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty({ required: false, minimum: 1, maximum: 5 }),
    IsOptional(),
    IsInt(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "fachkompetenz", void 0);
__decorate([
    ApiProperty({ required: false, minimum: 1, maximum: 5 }),
    IsOptional(),
    IsInt(),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], CreateFeedbackDto.prototype, "softskills", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MaxLength(2000),
    __metadata("design:type", String)
], CreateFeedbackDto.prototype, "kommentar", void 0);
export class FeedbackResponseDto {
    id;
    vonUserId;
    anUserId;
    abteilungId;
    typ;
    fachkompetenz;
    softskills;
    kommentar;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FeedbackResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FeedbackResponseDto.prototype, "vonUserId", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FeedbackResponseDto.prototype, "anUserId", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FeedbackResponseDto.prototype, "abteilungId", void 0);
__decorate([
    ApiProperty({ enum: FeedbackTyp }),
    __metadata("design:type", String)
], FeedbackResponseDto.prototype, "typ", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FeedbackResponseDto.prototype, "fachkompetenz", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FeedbackResponseDto.prototype, "softskills", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FeedbackResponseDto.prototype, "kommentar", void 0);
//# sourceMappingURL=feedback.dto.js.map