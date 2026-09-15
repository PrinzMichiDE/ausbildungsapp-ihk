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
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, } from 'class-validator';
export var SkillStatusDto;
(function (SkillStatusDto) {
    SkillStatusDto["nicht_begonnen"] = "nicht_begonnen";
    SkillStatusDto["in_arbeit"] = "in_arbeit";
    SkillStatusDto["vermittelt"] = "vermittelt";
})(SkillStatusDto || (SkillStatusDto = {}));
export var LernpfadPrioritaetDto;
(function (LernpfadPrioritaetDto) {
    LernpfadPrioritaetDto["hoch"] = "hoch";
    LernpfadPrioritaetDto["mittel"] = "mittel";
    LernpfadPrioritaetDto["niedrig"] = "niedrig";
})(LernpfadPrioritaetDto || (LernpfadPrioritaetDto = {}));
export class CreateSkillAssignmentDto {
    azubiId;
    frameworkId;
    courseId;
    status;
    bemerkungen;
}
__decorate([
    ApiProperty({ description: 'ID des Azubis' }),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateSkillAssignmentDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ description: 'ID des IHK-Lernfelds (Framework)' }),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateSkillAssignmentDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty({ required: false, description: 'ID des Kurses (optional)' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateSkillAssignmentDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ required: false, enum: SkillStatusDto, default: SkillStatusDto.nicht_begonnen }),
    IsOptional(),
    IsEnum(SkillStatusDto),
    __metadata("design:type", String)
], CreateSkillAssignmentDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ required: false, description: 'Bemerkungen zur Zuordnung' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateSkillAssignmentDto.prototype, "bemerkungen", void 0);
export class UpdateSkillAssignmentDto extends PartialType(CreateSkillAssignmentDto) {
    fortschritt;
}
__decorate([
    ApiProperty({ required: false, minimum: 0, maximum: 100 }),
    IsOptional(),
    IsInt(),
    Min(0),
    Max(100),
    __metadata("design:type", Number)
], UpdateSkillAssignmentDto.prototype, "fortschritt", void 0);
export class MarkVermitteltDto {
    bemerkungen;
}
__decorate([
    ApiProperty({ required: false, description: 'Optionale Bemerkungen zur Vermittlung' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], MarkVermitteltDto.prototype, "bemerkungen", void 0);
export class SkillAssignmentResponseDto {
    id;
    azubiId;
    frameworkId;
    courseId;
    status;
    fortschritt;
    vermitteltVon;
    vermitteltAm;
    bemerkungen;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillAssignmentResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillAssignmentResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillAssignmentResponseDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], SkillAssignmentResponseDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ enum: SkillStatusDto }),
    __metadata("design:type", String)
], SkillAssignmentResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ minimum: 0, maximum: 100 }),
    __metadata("design:type", Number)
], SkillAssignmentResponseDto.prototype, "fortschritt", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], SkillAssignmentResponseDto.prototype, "vermitteltVon", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], SkillAssignmentResponseDto.prototype, "vermitteltAm", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], SkillAssignmentResponseDto.prototype, "bemerkungen", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], SkillAssignmentResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], SkillAssignmentResponseDto.prototype, "updatedAt", void 0);
export class SkillGapResponseDto {
    frameworkId;
    frameworkTitel;
    lernfeld;
    kompetenz;
    status;
    fortschritt;
    erforderlich;
    kurseTotal;
    kurseVermittelt;
    fehlendeKurse;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapResponseDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapResponseDto.prototype, "frameworkTitel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapResponseDto.prototype, "lernfeld", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapResponseDto.prototype, "kompetenz", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], SkillGapResponseDto.prototype, "status", void 0);
__decorate([
    ApiProperty({ minimum: 0, maximum: 100 }),
    __metadata("design:type", Number)
], SkillGapResponseDto.prototype, "fortschritt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], SkillGapResponseDto.prototype, "erforderlich", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillGapResponseDto.prototype, "kurseTotal", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], SkillGapResponseDto.prototype, "kurseVermittelt", void 0);
__decorate([
    ApiProperty({ type: [String] }),
    __metadata("design:type", Array)
], SkillGapResponseDto.prototype, "fehlendeKurse", void 0);
export class SkillGapQueryDto {
    azubiId;
    frameworkId;
    beruf;
}
__decorate([
    ApiProperty({ required: false, description: 'Filter nach Azubi-ID' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], SkillGapQueryDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ required: false, description: 'Filter nach Framework/Lernfeld-ID' }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], SkillGapQueryDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty({ required: false, description: 'Filter nach Ausbildungsberuf' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], SkillGapQueryDto.prototype, "beruf", void 0);
export class BenchmarkResponseDto {
    id;
    jahrgang;
    beruf;
    lernfeldId;
    durchschnittNote;
    durchschnittAbdeckungProzent;
    durchschnittFortschritt;
    azubiAnzahl;
    berechnetAm;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BenchmarkResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BenchmarkResponseDto.prototype, "jahrgang", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BenchmarkResponseDto.prototype, "beruf", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], BenchmarkResponseDto.prototype, "lernfeldId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BenchmarkResponseDto.prototype, "durchschnittNote", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BenchmarkResponseDto.prototype, "durchschnittAbdeckungProzent", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BenchmarkResponseDto.prototype, "durchschnittFortschritt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Number)
], BenchmarkResponseDto.prototype, "azubiAnzahl", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], BenchmarkResponseDto.prototype, "berechnetAm", void 0);
export class CreateLernpfadDto {
    azubiId;
    courseId;
    prioritaet;
    skipBegründung;
    ausgeschlossen;
}
__decorate([
    ApiProperty({ description: 'ID des Azubis' }),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateLernpfadDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty({ description: 'ID des Kurses' }),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateLernpfadDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ enum: LernpfadPrioritaetDto, default: LernpfadPrioritaetDto.mittel }),
    IsEnum(LernpfadPrioritaetDto),
    __metadata("design:type", String)
], CreateLernpfadDto.prototype, "prioritaet", void 0);
__decorate([
    ApiProperty({ required: false, description: 'Begründung für Skip' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateLernpfadDto.prototype, "skipBegr\u00FCndung", void 0);
__decorate([
    ApiProperty({ required: false, default: false }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], CreateLernpfadDto.prototype, "ausgeschlossen", void 0);
export class UpdateLernpfadDto extends PartialType(CreateLernpfadDto) {
}
export class LernpfadResponseDto {
    id;
    azubiId;
    courseId;
    prioritaet;
    skipBegründung;
    ausgeschlossen;
    erstelltVon;
    createdAt;
    updatedAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "azubiId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ enum: LernpfadPrioritaetDto }),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "prioritaet", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], LernpfadResponseDto.prototype, "skipBegr\u00FCndung", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], LernpfadResponseDto.prototype, "ausgeschlossen", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "erstelltVon", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], LernpfadResponseDto.prototype, "createdAt", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], LernpfadResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=skill-matrix.dto.js.map