import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ZeitraumGranularitaet {
  monat = 'monat',
  quartal = 'quartal',
  jahr = 'jahr',
}

export class ZeitraumQueryDto {
  @ApiPropertyOptional({ description: 'Jahr von inkl.', example: '2023' })
  jahrFrom?: string;

  @ApiPropertyOptional({ description: 'Jahr bis inkl.', example: '2026' })
  jahrTo?: string;

  @ApiPropertyOptional({ description: 'Granularität', enum: ZeitraumGranularitaet })
  granularitaet?: ZeitraumGranularitaet;

  @ApiPropertyOptional({ description: 'Fach Filter' })
  fach?: string;

  @ApiPropertyOptional({ description: 'Halbjahr erstes|zweites' })
  halbjahr?: string;

  @ApiPropertyOptional({ description: 'Abteilung ID Filter' })
  abteilungId?: string;

  @ApiPropertyOptional({ description: 'Beruf Filter', enum: ['systemintegration', 'anwendungsentwicklung', 'daten_prozessanalyse', 'digitale_vernetzung'] })
  beruf?: string;

  @ApiPropertyOptional({ description: 'Azubi ID Filter (nur wenn scope erlaubt)' })
  azubiId?: string;

  @ApiPropertyOptional({ description: 'Limit Pagination', example: '50' })
  limit?: string;

  @ApiPropertyOptional({ description: 'Offset Pagination', example: '0' })
  offset?: string;

  @ApiPropertyOptional({ description: 'von ISO Datum für Zeitreihe' })
  von?: string;

  @ApiPropertyOptional({ description: 'bis ISO Datum für Zeitreihe' })
  bis?: string;
}

export class SkillGapDto {
  @ApiProperty()
  lernfeld: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty()
  tasksTotal: number;

  @ApiProperty()
  reportsUsing: number;

  @ApiProperty({ description: '0–1' })
  coverage: number;

  @ApiProperty({ description: 'Summe Stunden via ReportTimeEntry' })
  istStunden: number;

  @ApiProperty({ description: 'hoch <30% | mittel 30-70% | niedrig >70%' })
  prioritaet: string;

  @ApiProperty({ type: [String], description: 'Fehlende Tasks Titel' })
  fehlendeTasks: string[];
}

export class CourseCompletionDto {
  @ApiProperty()
  courseId: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty()
  tasksTotal: number;

  @ApiProperty({ description: 'Completion Rate 0–1 pro sichtbare Azubis' })
  completionRate: number;

  @ApiProperty({ description: 'Completion Rate azubi-spezifisch wenn scoped' })
  completionRateAzubi: number;

  @ApiProperty({ description: 'Completion Rate abteilung falls verfügbar' })
  completionRateAbteilung: number;

  @ApiPropertyOptional({ description: 'Ø Tage bis Completion' })
  avgTage?: number;

  @ApiPropertyOptional({ description: 'Median Tage bis Completion' })
  medianTage?: number;

  @ApiProperty({ type: [Object], description: 'Tasks [{titel, usedCount}]' })
  tasks: Array<{ titel: string; usedCount: number }>;
}

export class QualitaetsScoreVerteilungDto {
  @ApiProperty()
  avg: number;

  @ApiProperty({ description: 'Histogram {0-50,51-70,71-85,86-100}' })
  histogram: Record<string, number>;
}

export class NotenTrendDto {
  @ApiProperty({ nullable: true })
  halbjahr: string | null;

  @ApiProperty({ nullable: true })
  fach: string | null;

  @ApiProperty()
  zeitraum: string;

  @ApiProperty()
  avgGewichtet: number;

  @ApiProperty()
  avgUngewichtet: number;

  @ApiProperty()
  count: number;

  @ApiProperty({ type: Date, nullable: true })
  datum: Date | null;
}

export class NotenVerteilungDto {
  @ApiProperty({ description: 'Histogram 1.x-6.x' })
  histogram: Record<string, number>;

  @ApiProperty()
  gesamt: number;

  @ApiProperty()
  avgGewichtet: number;

  @ApiProperty()
  avgUngewichtet: number;
}

export class NotenTrendResponseDto {
  @ApiProperty({ type: [NotenTrendDto] })
  trend: NotenTrendDto[];

  @ApiProperty({ type: [NotenTrendDto] })
  verlauf: NotenTrendDto[];

  @ApiProperty({ type: NotenVerteilungDto })
  verteilung: NotenVerteilungDto;
}

export class ZeitreiheDto {
  @ApiProperty({ example: '2025-Q1' })
  periode: string;

  @ApiPropertyOptional()
  reportQuoteAvg?: number;

  @ApiPropertyOptional()
  kompetenzCoverageAvg?: number;

  @ApiPropertyOptional()
  notenSchnitt?: number;

  @ApiPropertyOptional()
  azubiCount?: number;
}

export class KohortenBasisDto {
  @ApiProperty()
  jahr: number;

  @ApiProperty({ example: 'systemintegration', nullable: true })
  beruf: string | null;

  @ApiProperty()
  azubiCount: number;

  @ApiProperty()
  avgNotenSchnitt: number;

  @ApiProperty()
  avgReportQuote: number;

  @ApiProperty()
  avgKompetenzCoverage: number;

  @ApiPropertyOptional({ description: 'Anzahl Alumni in Kohorte' })
  alumniCount?: number;
}

export class KohortenVergleichDto {
  @ApiProperty()
  jahr: number;

  @ApiProperty({ nullable: true })
  beruf: string | null;

  @ApiProperty()
  azubiCount: number;

  @ApiProperty()
  avgNotenSchnitt: number;

  @ApiProperty()
  avgReportQuote: number;

  @ApiProperty()
  avgKompetenzCoverage: number;

  @ApiProperty()
  avgAbbruchquote: number;

  @ApiProperty()
  avgZufriedenheit: number;

  @ApiProperty({ type: Object, description: 'Trend vs Vorjahr {notenSchnittDelta, reportQuoteDelta}' })
  trend: Record<string, number>;
}

export class WarnFilterQueryDto {
  @ApiPropertyOptional({ description: 'Kategorie filter', example: 'note_fruehwarnung' })
  kategorie?: string;

  @ApiPropertyOptional({ description: 'Fach filter' })
  fach?: string;

  @ApiPropertyOptional({ enum: ['gut', 'warnung', 'kritisch'], description: 'Severity filter' })
  severity?: string;
}
