import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'max.mustermann@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SicheresPasswort123!' })
  @IsString()
  password: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class MfaVerifyDto {
  @ApiProperty({ description: 'Mfa-Pending-Token aus dem Login' })
  @IsString()
  pendingToken: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Muss ein 6-stelliger Code sein' })
  code: string;
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    abteilungIds: string[];
  };
}

export class MfaPendingResponseDto {
  @ApiProperty()
  mfaRequired: boolean;

  @ApiProperty({ description: 'Token zum Abschluss der MFA-Verifikation' })
  pendingToken: string;

  @ApiProperty({ nullable: true })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
}
