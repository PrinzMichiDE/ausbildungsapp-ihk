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
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, IsUUID, Matches, MinLength, } from 'class-validator';
import { Role, ALL_ROLES } from '../../../common/constants/roles.js';
export class CreateUserDto {
    email;
    password;
    firstName;
    lastName;
    roles;
    abteilungIds;
}
__decorate([
    ApiProperty({ example: 'max.mustermann@example.com' }),
    IsEmail(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    ApiProperty({ example: 'SicheresPasswort123!', minLength: 8 }),
    IsString(),
    MinLength(8),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    ApiProperty({ example: 'Max' }),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty({ example: 'Mustermann' }),
    IsString(),
    MinLength(2),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty({ enum: ALL_ROLES, isArray: true, example: [Role.azubi] }),
    IsArray(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roles", void 0);
__decorate([
    ApiProperty({
        required: false,
        isArray: true,
        description: 'Nur für ausbildungsbeauftragter relevant',
    }),
    IsOptional(),
    IsArray(),
    IsUUID('4', { each: true }),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "abteilungIds", void 0);
export class UpdateUserDto {
    roles;
    abteilungIds;
    isActive;
}
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsArray(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "roles", void 0);
__decorate([
    ApiProperty({ required: false, isArray: true }),
    IsOptional(),
    IsArray(),
    IsUUID('4', { each: true }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "abteilungIds", void 0);
__decorate([
    ApiProperty({ required: false }),
    IsOptional(),
    IsBoolean(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);
export class UserResponseDto {
    id;
    email;
    firstName;
    lastName;
    isActive;
    roles;
    abteilungIds;
    mfaActive;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "email", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "firstName", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], UserResponseDto.prototype, "lastName", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "isActive", void 0);
__decorate([
    ApiProperty({ enum: ALL_ROLES, isArray: true }),
    __metadata("design:type", Array)
], UserResponseDto.prototype, "roles", void 0);
__decorate([
    ApiProperty({ isArray: true, required: false, nullable: true }),
    __metadata("design:type", Object)
], UserResponseDto.prototype, "abteilungIds", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Boolean)
], UserResponseDto.prototype, "mfaActive", void 0);
export class MfaSecretDto {
    secret;
    otpauthUrl;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], MfaSecretDto.prototype, "secret", void 0);
__decorate([
    ApiProperty({ description: 'URI zum Einrichten in einer Authenticator-App' }),
    __metadata("design:type", String)
], MfaSecretDto.prototype, "otpauthUrl", void 0);
export class MfaEnableDto {
    code;
}
__decorate([
    ApiProperty({ example: '123456', description: '6-stelliger TOTP-Code' }),
    IsString(),
    Matches(/^\d{6}$/, { message: 'Muss ein 6-stelliger Code sein' }),
    __metadata("design:type", String)
], MfaEnableDto.prototype, "code", void 0);
export class MfaDisableDto {
    code;
}
__decorate([
    ApiProperty({ example: '123456' }),
    IsString(),
    Matches(/^\d{6}$/, { message: 'Muss ein 6-stelliger Code sein' }),
    __metadata("design:type", String)
], MfaDisableDto.prototype, "code", void 0);
//# sourceMappingURL=user.dto.js.map