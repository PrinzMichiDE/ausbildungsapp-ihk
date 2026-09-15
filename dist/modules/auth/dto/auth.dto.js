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
import { IsEmail, IsString, Matches, } from 'class-validator';
export class LoginDto {
    email;
    password;
}
__decorate([
    ApiProperty({ example: 'max.mustermann@example.com' }),
    IsEmail(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: 'SicheresPasswort123!' }),
    IsString(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
export class RefreshDto {
    refreshToken;
}
__decorate([
    ApiProperty(),
    IsString(),
    __metadata("design:type", String)
], RefreshDto.prototype, "refreshToken", void 0);
export class MfaVerifyDto {
    pendingToken;
    code;
}
__decorate([
    ApiProperty({ description: 'Mfa-Pending-Token aus dem Login' }),
    IsString(),
    __metadata("design:type", String)
], MfaVerifyDto.prototype, "pendingToken", void 0);
__decorate([
    ApiProperty({ example: '123456' }),
    IsString(),
    Matches(/^\d{6}$/, { message: 'Muss ein 6-stelliger Code sein' }),
    __metadata("design:type", String)
], MfaVerifyDto.prototype, "code", void 0);
export class AuthResponseDto {
    accessToken;
    refreshToken;
    user;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Object)
], AuthResponseDto.prototype, "user", void 0);
export class MfaPendingResponseDto {
    mfaRequired;
    pendingToken;
    user;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], MfaPendingResponseDto.prototype, "mfaRequired", void 0);
__decorate([
    ApiProperty({ description: 'Token zum Abschluss der MFA-Verifikation' }),
    __metadata("design:type", String)
], MfaPendingResponseDto.prototype, "pendingToken", void 0);
__decorate([
    ApiProperty({ nullable: true }),
    __metadata("design:type", Object)
], MfaPendingResponseDto.prototype, "user", void 0);
//# sourceMappingURL=auth.dto.js.map