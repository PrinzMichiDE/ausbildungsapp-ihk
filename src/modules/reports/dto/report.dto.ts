import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus, ReportTyp } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 'KW 12 – Netzwerkinfrastruktur' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ enum: ReportTyp, example: ReportTyp.betrieb })
  @IsEnum(ReportTyp)
  typ: ReportTyp;

  @ApiProperty({ example: 12, minimum: 1, maximum: 53 })
  @IsInt()
  @Min(1)
  @Max(53)
  kalenderwoche: number;

  @ApiProperty({ example: 2026 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  jahr: number;

  @ApiProperty({ example: '2026-03-16' })
  @IsDateString()
  datumVon: string;

  @ApiProperty({ example: '2026-03-20' })
  @IsDateString()
  datumBis: string;

  @ApiProperty({ description: 'Markdown inkl. Code-Blöcken' })
  @IsString()
  @MinLength(1)
  inhaltMarkdown: string;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  taskIds?: string[];
}

export class UpdateReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel?: string;

  @ApiProperty({ required: false, enum: ReportTyp })
  @IsOptional()
  @IsEnum(ReportTyp)
  typ?: ReportTyp;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(53)
  kalenderwoche?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  jahr?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  datumVon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  datumBis?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inhaltMarkdown?: string;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  taskIds?: string[];
}

export class ReviewReportDto {
  @ApiProperty({ enum: ['freigeben', 'zurueck'], example: 'freigeben' })
  @IsEnum(['freigeben', 'zurueck'])
  entscheidung: 'freigeben' | 'zurueck';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  kommentar?: string;
}

export class AddCommentDto {
  @ApiProperty({ example: 'Bitte den SSH-Härtungs-Schritt ergänzen.' })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  text: string;

  @ApiProperty({ enum: KommentarArt, required: false, example: KommentarArt.allgemein })
  @IsOptional()
  @IsEnum(KommentarArt)
  art?: KommentarArt;
}

export class ReportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  titel: string;

  @ApiProperty({ enum: ReportTyp })
  typ: ReportTyp;

  @ApiProperty()
  kalenderwoche: number;

  @ApiProperty()
  jahr: number;

  @ApiProperty()
  datumVon: Date;

  @ApiProperty()
  datumBis: Date;

  @ApiProperty()
  inhaltMarkdown: string;

  @ApiProperty({ enum: ReportStatus })
  status: ReportStatus;

  @ApiProperty({ nullable: true })
  signiertVon: string | null;

  @ApiProperty({ nullable: true })
  signiertAm: Date | null;

  @ApiProperty({ nullable: true })
  archiviertAm: Date | null;

  @ApiProperty({ isArray: true })
  taskIds: string[];

  @ApiProperty()
  createdAt: Date;
}

export enum AttachmentTyp {
  screenshot = 'screenshot',
  diagramm = 'diagramm',
  code = 'code',
  sonstiges = 'sonstiges',
}

export enum KommentarArt {
  allgemein = 'allgemein',
  fachlich = 'fachlich',
  formal = 'formal',
  aufgabenkopplung = 'aufgabenkopplung',
}

export class AddAttachmentDto {
  @ApiProperty({ enum: AttachmentTyp, example: AttachmentTyp.screenshot })
  @IsEnum(AttachmentTyp)
  typ: AttachmentTyp;

  @ApiProperty({ example: 'https://storage.example.com/report-attachment.png' })
  @IsString()
  @MinLength(1)
  dateiUrl: string;

  @ApiProperty({ required: false, example: 'Screenshot der Netzwerkkonfiguration' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  kommentar?: string;
}

export class AddTimeEntryDto {
  @ApiProperty({ required: false, description: 'Verknüpfte Task-ID' })
  @IsOptional()
  @IsUUID('4')
  taskId?: string;

  @ApiProperty({ example: 2.5, minimum: 0.5, maximum: 24 })
  @IsNumber()
  @Min(0.5)
  @Max(24)
  stunden: number;

  @ApiProperty({ required: false, example: 'Netzwerkkonfiguration konfiguriert' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  kommentar?: string;
}

export class BatchReviewDto {
  @ApiProperty({ isArray: true, description: 'Report-IDs für Batch-Review' })
  @IsArray()
  @IsUUID('4', { each: true })
  reportIds: string[];

  @ApiProperty({ enum: ['freigeben', 'zurueck'], example: 'freigeben' })
  @IsEnum(['freigeben', 'zurueck'])
  entscheidung: 'freigeben' | 'zurueck';

  @ApiProperty({ required: false, example: 'Bitte ergänzen Sie die fehlenden Abschnitte.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  kommentar?: string;
}

export class VersionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reportId: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  inhaltMarkdown: string;

  @ApiProperty({ nullable: true })
  erstelltVon: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class DiffResponseDto {
  @ApiProperty({ description: 'Inhalt der älteren Version' })
  v1: string;

  @ApiProperty({ description: 'Inhalt der neueren Version' })
  v2: string;
}
