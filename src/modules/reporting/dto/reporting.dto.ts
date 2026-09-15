import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class ReportQuoteDto {
  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  kalenderwochen: number;

  @ApiProperty()
  eingereicht: number;

  @ApiProperty({ description: '0–1' })
  quote: number;
}

export class SkillCoverageDto {
  @ApiProperty()
  courseId: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty()
  tasksTotal: number;

  @ApiProperty()
  reportsUsing: number;

  @ApiProperty({ description: '0–1' })
  coverage: number;
}

export class AbteilungsZufriedenheitDto {
  @ApiProperty()
  abteilungId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  avgFachkompetenz: number;

  @ApiProperty()
  avgSoftskills: number;
}

export enum WarnSeverity {
  gut = 'gut',
  warnung = 'warnung',
  kritisch = 'kritisch',
}

export enum WarnTyp {
  note_fruehwarnung = 'note_fruehwarnung',
  fehlende_berichte = 'fehlende_berichte',
  foerderbedarf = 'foerderbedarf',
  pruefung_frist = 'pruefung_frist',
  onboarding_rueckstand = 'onboarding_rueckstand',
  kapazitaet = 'kapazitaet',
  fehlende_aufgaben = 'fehlende_aufgaben',
}

export class FruchwarnDto {
  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: WarnTyp, description: 'Warn-Typ' })
  type: string;

  @ApiProperty()
  details: string;

  @ApiPropertyOptional({ enum: WarnSeverity, description: 'Severity' })
  severity?: WarnSeverity;

  @ApiPropertyOptional({ description: 'Fach falls zutreffend' })
  fach?: string;
}

export interface DashboardResult {
  role: string;
  stats: Record<string, number>;
  warnings: FruchwarnDto[];
}

export enum ReportingExportKind {
  attendance = 'attendance',
  grades = 'grades',
  competency = 'competency',
  noten_trend = 'noten_trend',
  skill_gap = 'skill_gap',
  kohorten = 'kohorten',
  warnliste = 'warnliste',
  course_completion = 'course_completion',
  zeitreihe = 'zeitreihe',
}

export class ExportQueryDto {
  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ description: 'Jahr' })
  @IsOptional()
  @IsString()
  jahr?: string;

  @ApiPropertyOptional({ description: 'Format csv|json|pdf', example: 'csv' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'noCache=true bypass cache' })
  @IsOptional()
  @IsString()
  noCache?: string;

  @ApiPropertyOptional({ description: 'Fach filter' })
  @IsOptional()
  @IsString()
  fach?: string;

  @ApiPropertyOptional({ description: 'Abteilung filter' })
  @IsOptional()
  @IsString()
  abteilungId?: string;
}

export class ExportKindDto {
  @ApiProperty({ enum: ReportingExportKind })
  @IsEnum(ReportingExportKind)
  kind: ReportingExportKind;
}

export class ZeitraumDto {
  @ApiPropertyOptional({ description: 'von ISO Datum' })
  @IsOptional()
  @IsString()
  von?: string;

  @ApiPropertyOptional({ description: 'bis ISO Datum' })
  @IsOptional()
  @IsString()
  bis?: string;

  @ApiPropertyOptional({ description: 'Halbjahr' })
  @IsOptional()
  @IsString()
  halbjahr?: string;
}

export function toCsv(rows: ReadonlyArray<Record<string, unknown>>): string {
  if (rows.length === 0) {
    return '';
  }
  const headers = Object.keys(rows[0]);
  const escape = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    if (/[",\n\r]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ];
  return lines.join('\r\n');
}