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
import { IsArray, IsOptional, IsString, IsUUID, MaxLength, MinLength, } from 'class-validator';
export class CreateFrameworkDto {
    titel;
    lernfeld;
    kompetenz;
    beschreibung;
    quelle;
}
__decorate([
    ApiProperty({ example: 'IT-Systeme integrieren und konfigurieren' }),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], CreateFrameworkDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ example: 'Netzwerk- und Serverinfrastrukturen bereitstellen' }),
    IsString(),
    MinLength(3),
    MaxLength(300),
    __metadata("design:type", String)
], CreateFrameworkDto.prototype, "lernfeld", void 0);
__decorate([
    ApiProperty({ example: 'Netzwerkinfrastrukturen planen' }),
    IsString(),
    MinLength(3),
    __metadata("design:type", String)
], CreateFrameworkDto.prototype, "kompetenz", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFrameworkDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false, example: 'IHK-Rahmenplan FIS' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateFrameworkDto.prototype, "quelle", void 0);
export class UpdateFrameworkDto {
    titel;
    lernfeld;
    kompetenz;
    beschreibung;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    MinLength(3),
    MaxLength(200),
    __metadata("design:type", String)
], UpdateFrameworkDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateFrameworkDto.prototype, "lernfeld", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateFrameworkDto.prototype, "kompetenz", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UpdateFrameworkDto.prototype, "beschreibung", void 0);
export class CreateCourseDto {
    frameworkId;
    titel;
    beschreibung;
    lernziele;
    theorie;
}
__decorate([
    ApiProperty(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty({ example: 'Grundlagen TCP/IP & Subnetting' }),
    IsString(),
    MinLength(3),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true }),
    IsOptional(),
    IsArray(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateCourseDto.prototype, "lernziele", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateCourseDto.prototype, "theorie", void 0);
export class CreateTaskDto {
    frameworkId;
    courseId;
    titel;
    beschreibung;
    musterloesung;
}
__decorate([
    ApiProperty(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ example: 'IP-Adresskonzept für ein internes Testnetz erstellen' }),
    IsString(),
    MinLength(3),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "musterloesung", void 0);
export class UpdateCourseDto extends PartialType(CreateCourseDto) {
}
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
}
export class UploadAiDocumentDto {
    filename;
    quelle;
    inhalt;
}
__decorate([
    ApiProperty({ example: 'ihk-rahmenplan-fis.pdf' }),
    IsString(),
    MinLength(3),
    __metadata("design:type", String)
], UploadAiDocumentDto.prototype, "filename", void 0);
__decorate([
    ApiProperty({ required: false, example: 'IHK' }),
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], UploadAiDocumentDto.prototype, "quelle", void 0);
__decorate([
    ApiProperty({ description: 'Volltext des importierten Dokuments' }),
    IsString(),
    MinLength(10),
    __metadata("design:type", String)
], UploadAiDocumentDto.prototype, "inhalt", void 0);
export class GenerateFromDocDto {
    documentId;
}
__decorate([
    ApiProperty({ description: 'ID des vektorisierten IHK-Dokuments' }),
    IsUUID('4'),
    __metadata("design:type", String)
], GenerateFromDocDto.prototype, "documentId", void 0);
export class FrameworkResponseDto {
    id;
    titel;
    lernfeld;
    kompetenz;
    beschreibung;
    quelle;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FrameworkResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FrameworkResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FrameworkResponseDto.prototype, "lernfeld", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], FrameworkResponseDto.prototype, "kompetenz", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FrameworkResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], FrameworkResponseDto.prototype, "quelle", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], FrameworkResponseDto.prototype, "createdAt", void 0);
export class CourseResponseDto {
    id;
    frameworkId;
    titel;
    beschreibung;
    lernziele;
    theorie;
    freigegeben;
    kiGeneriert;
    qualitaetsScore;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CourseResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], CourseResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ isArray: true }),
    __metadata("design:type", Array)
], CourseResponseDto.prototype, "lernziele", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], CourseResponseDto.prototype, "theorie", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], CourseResponseDto.prototype, "freigegeben", void 0);
__decorate([
    ApiProperty({ description: 'KI-generiert gemäß EU AI Act §6.3' }),
    __metadata("design:type", Boolean)
], CourseResponseDto.prototype, "kiGeneriert", void 0);
__decorate([
    ApiProperty({ nullable: true, description: 'Qualitäts-Score (0-100)' }),
    __metadata("design:type", Object)
], CourseResponseDto.prototype, "qualitaetsScore", void 0);
export class TaskResponseDto {
    id;
    frameworkId;
    courseId;
    titel;
    beschreibung;
    musterloesung;
    freigegeben;
    kiGeneriert;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "frameworkId", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], TaskResponseDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "titel", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], TaskResponseDto.prototype, "beschreibung", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], TaskResponseDto.prototype, "musterloesung", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], TaskResponseDto.prototype, "freigegeben", void 0);
__decorate([
    ApiProperty({ description: 'KI-generiert gemäß EU AI Act §6.3' }),
    __metadata("design:type", Boolean)
], TaskResponseDto.prototype, "kiGeneriert", void 0);
//# sourceMappingURL=learning-content.dto.js.map