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
import { IsUUID, IsEnum } from 'class-validator';
import { Prioritaet } from '../../../common/enums/ausbildungsmanagement.enums.js';
export class CreateLernpfadDto {
    courseId;
    prioritaet;
    skipBegruendung;
}
__decorate([
    ApiProperty({ example: 'course-uuid' }),
    IsUUID('4'),
    __metadata("design:type", String)
], CreateLernpfadDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ enum: Prioritaet }),
    IsEnum(Prioritaet),
    __metadata("design:type", String)
], CreateLernpfadDto.prototype, "prioritaet", void 0);
__decorate([
    ApiProperty({ required: false, example: true }),
    __metadata("design:type", Boolean)
], CreateLernpfadDto.prototype, "skipBegruendung", void 0);
export class LernpfadResponseDto {
    id;
    courseId;
    prioritaet;
    skipBegruendung;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "courseId", void 0);
__decorate([
    ApiProperty({ enum: Prioritaet }),
    __metadata("design:type", String)
], LernpfadResponseDto.prototype, "prioritaet", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], LernpfadResponseDto.prototype, "skipBegruendung", void 0);
//# sourceMappingURL=lernpfad.dto.js.map