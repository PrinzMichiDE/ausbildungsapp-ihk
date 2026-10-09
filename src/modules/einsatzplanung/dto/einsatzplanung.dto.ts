import { IsUUID, IsDate, IsOptional, IsEnum, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EinsatzStatus {
  GEPLANT = 'geplant',
  BESTATIGT = 'bestatigt',
  ABGESCHLOSSEN = 'abgeschlossen',
  STORNIERT = 'storniert',
}

export class CreateEinsatzPlanungDto {
  @ApiProperty()
  @IsUUID()
  azubiId: string;

  @ApiProperty()
  @IsUUID()
  abteilungId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  von: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  bis: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EinsatzStatus)
  status?: EinsatzStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kommentar?: string;
}

export class UpdateEinsatzPlanungDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  azubiId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  abteilungId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  von?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  bis?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EinsatzStatus)
  status?: EinsatzStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kommentar?: string;
}

export class EinsatzPlanungQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  azubiId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  abteilungId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EinsatzStatus)
  status?: EinsatzStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  von?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  bis?: Date;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class EinsatzPlanungResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  abteilungId: string;

  @ApiProperty()
  von: Date;

  @ApiProperty()
  bis: Date;

  @ApiPropertyOptional()
  beschreibung?: string;

  @ApiProperty()
  status: EinsatzStatus;

  @ApiPropertyOptional()
  kommentar?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class EinsatzUserAssignmentDto {
  @ApiProperty()
  @IsUUID()
  azubiId: string;
}