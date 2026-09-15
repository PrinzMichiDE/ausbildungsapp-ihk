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
export class AuditResponseDto {
    id;
    userId;
    action;
    entity;
    entityId;
    details;
    ipAddress;
    userAgent;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AuditResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AuditResponseDto.prototype, "userId", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AuditResponseDto.prototype, "action", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AuditResponseDto.prototype, "entity", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AuditResponseDto.prototype, "entityId", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AuditResponseDto.prototype, "details", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AuditResponseDto.prototype, "ipAddress", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], AuditResponseDto.prototype, "userAgent", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], AuditResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=audit.dto.js.map