import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBadgeDto {
  @ApiProperty({ example: 'punktlich-berichtet' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  schluessel: string;

  @ApiProperty({ example: 'Immer pünktlich berichtet' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  beschreibung?: string;

  @ApiProperty({ required: false, example: 'pi-check' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}

export class BadgeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  schluessel: string;

  @ApiProperty()
  titel: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  icon: string | null;
}

export class UserBadgeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  earnedAt: Date;

  @ApiProperty()
  badge: BadgeResponseDto;
}
