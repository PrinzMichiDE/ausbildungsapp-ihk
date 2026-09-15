import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateZertifikatDto {
  @ApiProperty({ required: false, description: 'Nur für HR/Ausbilder' })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiProperty({ example: 'AWS Certified Cloud Practitioner' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ example: 'Amazon Web Services' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  aussteller: string;

  @ApiProperty({ example: '2026-05-12' })
  @IsDateString()
  erworbenAm: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  dokumentUrl?: string;
}

export class UpdateZertifikatDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aussteller?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  erworbenAm?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dokumentUrl?: string;
}

export class ZertifikatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  titel: string;

  @ApiProperty()
  aussteller: string;

  @ApiProperty()
  erworbenAm: Date;

  @ApiProperty({ nullable: true })
  dokumentUrl: string | null;
}
