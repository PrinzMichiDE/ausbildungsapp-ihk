import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean, IsUUID, IsDateString, Min, Max } from 'class-validator';
import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart, ReportStatus } from '@prisma/client';

export class DashboardResult {
  @ApiProperty({ description: 'Rollenbasierte Dashboard-Daten' })
  role: string;

  @ApiProperty({ description: 'KPI-Statistiken' })
  stats: Record<string, number>;

  @ApiProperty({ description: 'Frühwarnungen und Warnungen' })
  warnings: any[];
}

export class SkillCoverageDto {
  @ApiProperty()
  courseId: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty({ description: '0–1' })
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

export class NotenTrendDto {
  @ApiProperty({ enum: Halbjahr })
  halbjahr: Halbjahr;

  @ApiProperty()
  fach: string;

  @ApiProperty()
  zeitraum: string;

  @ApiProperty()
  schnittGewichtet: number;

  @ApiProperty()
  noteCount: number;
}

export class NotenVerteilungDto {
  @ApiProperty({ description: 'Noten-Verteilung von 1–6' })
  note1: number;

  @ApiProperty()
  note2: number;

  @ApiProperty()
  note3: number;

  @ApiProperty()
  note4: number;

  @ApiProperty()
  note5: number;

  @ApiProperty()
  note6: number;
}

export class ZeitreiheDto {
  @ApiProperty()
  periode: string;

  @ApiProperty()
  reportQuoteAvg: number;

  @ApiProperty()
  kompetenzCoverageAvg: number;

  @ApiProperty()
  notenSchnitt: number;
}

export class KohortenDto {
  @ApiProperty()
  jahr: number;

  @ApiProperty()
  beruf: string;

  @ApiProperty()
  azubiCount: number;

  @ApiProperty()
  avgNotenSchnittGewichtet: number;

  @ApiProperty()
  avgReportQuote: number;

  @ApiProperty()
  avgKompetenzCoverage: number;

  @ApiProperty()
  trendNotenSchnitt: number;

  @ApiProperty()
  trendReportQuote: number;
}

export class FruchwarnDto {
  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  details: string;

  @ApiProperty({ description: 'Schwäche der Warnung' })
  severity?: string;
}

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

export enum WarnTyp {
  note_fruehwarnung = 'note_fruehwarnung',
  fehlende_berichte = 'fehlende_berichte',
  foerderbedarf = 'foerderbedarf',
  pruefung_frist = 'pruefung_frist',
  onboarding_rueckstand = 'onboarding_rueckstand',
  kapazitaet = 'kapazitaet',
  fehlende_aufgaben = 'fehlende_aufgaben',
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

export class ExportKindDto {
  @ApiProperty({ enum: ReportingExportKind })
  @IsEnum(ReportingExportKind)
  kind: ReportingExportKind;
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
