import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { Role, ALL_ROLES } from '../../../common/constants/roles.js';

export class CreateUserDto {
  @ApiProperty({ example: 'max.mustermann@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SicheresPasswort123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Max' })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Mustermann' })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({ enum: ALL_ROLES, isArray: true, example: [Role.azubi] })
  @IsArray()
  roles: Role[];

  @ApiProperty({
    required: false,
    isArray: true,
    description: 'Nur für ausbildungsbeauftragter relevant',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  abteilungIds?: string[];
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  roles?: Role[];

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  abteilungIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ enum: ALL_ROLES, isArray: true })
  roles: Role[];

  @ApiProperty({ isArray: true, required: false, nullable: true })
  abteilungIds: string[] | null;

  @ApiProperty()
  mfaActive: boolean;
}

export class MfaSecretDto {
  @ApiProperty()
  secret: string;

  @ApiProperty({ description: 'URI zum Einrichten in einer Authenticator-App' })
  otpauthUrl: string;
}

export class MfaEnableDto {
  @ApiProperty({ example: '123456', description: '6-stelliger TOTP-Code' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Muss ein 6-stelliger Code sein' })
  code: string;
}

export class MfaDisableDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Muss ein 6-stelliger Code sein' })
  code: string;
}
