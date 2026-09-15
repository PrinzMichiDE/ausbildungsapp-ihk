import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ConsentAction,
  DatenschutzRequestStatus,
  DatenschutzRequestTyp,
  DpiaRisk,
  DpiaStatus,
  LegalBasisArticle,
} from '@prisma/client';

export class CreateDatenschutzRequestDto {
  @ApiProperty({ enum: DatenschutzRequestTyp })
  @IsEnum(DatenschutzRequestTyp)
  typ: DatenschutzRequestTyp;

  @ApiPropertyOptional({
    description: 'Nur für Ausbilder/HR/Admin: Ziel-Azubi, sonst selbst',
  })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  details?: string;
}

export class ProcessDatenschutzRequestDto {
  @ApiProperty({ enum: DatenschutzRequestStatus })
  @IsEnum(DatenschutzRequestStatus)
  status: DatenschutzRequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  result?: string;
}

export class DatenschutzRequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: DatenschutzRequestTyp })
  typ: DatenschutzRequestTyp;

  @ApiProperty({ enum: DatenschutzRequestStatus })
  status: DatenschutzRequestStatus;

  @ApiProperty({ nullable: true })
  details: string | null;

  @ApiProperty()
  requestedAt: Date;

  @ApiProperty({ nullable: true })
  dueDate: Date | null;

  @ApiProperty({ nullable: true })
  completedAt: Date | null;

  @ApiProperty({ nullable: true })
  result: string | null;

  @ApiProperty({ nullable: true })
  processedBy: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ConsentGrantDto {
  @ApiProperty({ example: 'gamification' })
  @IsString()
  key: string;

  @ApiPropertyOptional({ default: '1' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({ default: 'ui' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class ConsentRevokeDto {
  @ApiPropertyOptional({ default: '1' })
  @IsOptional()
  @IsString()
  version?: string;
}

export class ConsentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  version: string;

  @ApiProperty({ nullable: true })
  text: string | null;

  @ApiProperty()
  grantedAt: Date;

  @ApiProperty({ nullable: true })
  revokedAt: Date | null;

  @ApiProperty({ nullable: true })
  ipAddress: string | null;

  @ApiProperty({ nullable: true })
  source: string | null;

  @ApiProperty()
  active: boolean;
}

export class ConsentLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  version: string;

  @ApiProperty({ enum: ConsentAction })
  action: ConsentAction;

  @ApiProperty({ nullable: true })
  text: string | null;

  @ApiProperty({ nullable: true })
  ipAddress: string | null;

  @ApiProperty({ nullable: true })
  source: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class LegalBasisDto {
  @ApiProperty({ example: 'Ausbildungsvertrag' })
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  purpose: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  dataCategories: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiPropertyOptional({ example: 'Während der Ausbildung + 3 Jahre' })
  @IsOptional()
  @IsString()
  retentionPeriod?: string;

  @ApiProperty({ enum: LegalBasisArticle })
  @IsEnum(LegalBasisArticle)
  legalBasis: LegalBasisArticle;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  controller?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  active?: boolean;
}

export class UpdateLegalBasisDto extends PartialType(LegalBasisDto) {}

export class LegalBasisResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  purpose: string;

  @ApiProperty({ type: [String] })
  dataCategories: string[];

  @ApiProperty({ type: [String] })
  recipients: string[];

  @ApiProperty({ nullable: true })
  retentionPeriod: string | null;

  @ApiProperty({ enum: LegalBasisArticle })
  legalBasis: LegalBasisArticle;

  @ApiProperty({ nullable: true })
  controller: string | null;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class DpiaDto {
  @ApiProperty({ example: 'KI-Kursgenerierung (RAG)' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DpiaRisk })
  @IsEnum(DpiaRisk)
  riskLevel: DpiaRisk;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  measures?: string;

  @ApiProperty({ enum: DpiaStatus })
  @IsEnum(DpiaStatus)
  status: DpiaStatus;

  @ApiPropertyOptional({ description: 'Wann bewertet (ISO)' })
  @IsOptional()
  @IsString()
  assessedAt?: string;
}

export class UpdateDpiaDto extends PartialType(DpiaDto) {}

export class DpiaResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ enum: DpiaRisk })
  riskLevel: DpiaRisk;

  @ApiProperty({ nullable: true })
  measures: string | null;

  @ApiProperty({ enum: DpiaStatus })
  status: DpiaStatus;

  @ApiProperty({ nullable: true })
  assessedAt: Date | null;

  @ApiProperty({ nullable: true })
  assessedBy: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export interface PersonalDataExport {
  exportedAt: string;
  user: Record<string, unknown>;
  profile: Record<string, unknown>;
  einsaetze: unknown[];
  berichte: unknown[];
  zertifikate: unknown[];
  abwesenheiten: unknown[];
  noten: unknown[];
  checklisten: unknown[];
  feedbackGegeben: unknown[];
  feedbackErhalten: unknown[];
  pruefungen: unknown[];
  projekte: unknown[];
  konsente: unknown[];
}