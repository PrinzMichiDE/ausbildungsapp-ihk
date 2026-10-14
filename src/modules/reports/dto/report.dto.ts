import { ApiProperty } from '@nestjs/swagger';
import { ReportDayArt, ReportStatus, ReportTyp } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
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
  ValidateNested,
} from 'class-validator';

/** Absolute upper bound per activity; the effective daily limit is applied in the service. */
export const MAX_ACTIVITY_MINUTES = 600;
export const MIN_ACTIVITY_MINUTES = 5;
export const MAX_ACTIVITIES_PER_DAY = 30;
export const MAX_ACTIVITY_DESCRIPTION = 500;

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

export class CreateReportDto {
  @ApiProperty({ example: 'KW 42 – Netzwerkinfrastruktur' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ enum: ReportTyp, example: ReportTyp.betrieb, required: false })
  @IsOptional()
  @IsEnum(ReportTyp)
  typ?: ReportTyp;

  @ApiProperty({ example: 42, minimum: 1, maximum: 53 })
  @IsInt()
  @Min(1)
  @Max(53)
  kalenderwoche: number;

  @ApiProperty({ example: 2026 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  jahr: number;
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
}

export class ReportActivityInputDto {
  @ApiProperty({ example: 'Switch im Serverraum konfiguriert', maxLength: MAX_ACTIVITY_DESCRIPTION })
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_ACTIVITY_DESCRIPTION)
  beschreibung: string;

  @ApiProperty({ example: 150, description: 'Dauer in Minuten (Anzeige als hh:mm)', minimum: MIN_ACTIVITY_MINUTES, maximum: MAX_ACTIVITY_MINUTES })
  @IsInt()
  @Min(MIN_ACTIVITY_MINUTES)
  @Max(MAX_ACTIVITY_MINUTES)
  dauerMinuten: number;

  @ApiProperty({ required: false, description: 'Verknüpfter, freigegebener Praxis-Task' })
  @IsOptional()
  @IsUUID('4')
  taskId?: string;
}

export class ReportDayInputDto {
  @ApiProperty({ example: '2026-10-12' })
  @IsDateString({ strict: true })
  datum: string;

  @ApiProperty({ enum: ReportDayArt, example: ReportDayArt.betrieb })
  @IsEnum(ReportDayArt)
  art: ReportDayArt;

  @ApiProperty({ type: [ReportActivityInputDto] })
  @IsArray()
  @ArrayMaxSize(MAX_ACTIVITIES_PER_DAY)
  @ValidateNested({ each: true })
  @Type(() => ReportActivityInputDto)
  aktivitaeten: ReportActivityInputDto[];
}

export class SaveReportDaysDto {
  @ApiProperty({ type: [ReportDayInputDto], description: 'Komplette Woche; ersetzt alle bisherigen Tage' })
  @IsArray()
  @ArrayMaxSize(7)
  @ValidateNested({ each: true })
  @Type(() => ReportDayInputDto)
  tage: ReportDayInputDto[];
}

export class ReportActivityResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() beschreibung: string;
  @ApiProperty() dauerMinuten: number;
  @ApiProperty() sortierung: number;
  @ApiProperty({ nullable: true }) taskId: string | null;
  @ApiProperty({ nullable: true }) taskTitel: string | null;
}

export class ReportDayResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ example: '2026-10-12' }) datum: string;
  @ApiProperty({ enum: ReportDayArt }) art: ReportDayArt;
  @ApiProperty() summeMinuten: number;
  @ApiProperty({ description: 'Tagesgrenze in Minuten (JArbSchG-abhängig)' }) maxMinuten: number;
  @ApiProperty({ type: [ReportActivityResponseDto] }) aktivitaeten: ReportActivityResponseDto[];
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

  @ApiProperty({ description: 'Summe aller Aktivitäten der Woche in Minuten' })
  summeMinuten: number;

  @ApiProperty({ nullable: true, description: 'Wochengrenze in Minuten (nur bei Minderjährigen)' })
  maxMinutenWoche: number | null;

  @ApiProperty({ type: [ReportDayResponseDto], required: false, description: 'Nur in der Detailansicht' })
  tage?: ReportDayResponseDto[];

  @ApiProperty()
  createdAt: Date;
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
