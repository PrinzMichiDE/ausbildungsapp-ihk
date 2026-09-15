import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FruchwarnDto } from './reporting.dto.js';

export class AmpelStatusDto {
  @ApiProperty({ description: 'Grün ≤7 Tage' })
  gruen: number;

  @ApiProperty({ description: 'Gelb 8-14 Tage' })
  gelb: number;

  @ApiProperty({ description: 'Rot >14 Tage' })
  rot: number;
}

export class OffeneBerichteDto {
  @ApiProperty()
  gesamt: number;

  @ApiProperty({ type: AmpelStatusDto })
  ampel: AmpelStatusDto;

  @ApiPropertyOptional({ description: 'Ältester offener Bericht in Tagen' })
  aeltestesInTagen?: number;
}

export class HalbjahrTrendDto {
  @ApiProperty({ example: 'erstes', nullable: true })
  halbjahr: string | null;

  @ApiProperty({ example: 'Mathematik', nullable: true })
  fach: string | null;

  @ApiProperty({ example: '2025/2026' })
  zeitraum: string;

  @ApiProperty({ description: 'Gewichteter Durchschnitt' })
  avgGewichtet: number;

  @ApiProperty()
  count: number;
}

export class NotenStatDto {
  @ApiProperty()
  anzahl: number;

  @ApiProperty({ description: 'Gewichteter Schnitt SUM(note*gewichtung)/SUM(gewichtung)' })
  schnittGewichtet: number;

  @ApiProperty({ description: 'Ungewichteter Schnitt' })
  schnittUngewichtet: number;

  @ApiProperty({ type: [HalbjahrTrendDto] })
  halbjahrTrends: HalbjahrTrendDto[];

  @ApiPropertyOptional({ type: [HalbjahrTrendDto], description: 'Fach-Zeitreihe sortiert datum asc' })
  fachTrends?: HalbjahrTrendDto[];
}

export class ProjektPipelineDto {
  @ApiProperty()
  entwurf: number;

  @ApiProperty()
  eingereicht: number;

  @ApiProperty()
  freigegeben: number;

  @ApiProperty()
  abgelehnt: number;

  @ApiProperty()
  archiviert: number;

  @ApiProperty({ required: false })
  inPruefung?: number;
}

export class PruefungFristDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'ap2' })
  typ: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true, type: Date })
  ihkTermin: Date | null;

  @ApiProperty({ description: 'Tage bis Termin, negativ wenn überfällig' })
  faelligInTagen: number | null;

  @ApiPropertyOptional()
  titel?: string;
}

export class OnboardingQuoteDto {
  @ApiProperty()
  gesamt: number;

  @ApiProperty()
  erledigt: number;

  @ApiProperty({ description: '0–1' })
  quote: number;
}

export class BadgeProgressDto {
  @ApiProperty()
  gesamt: number;

  @ApiProperty()
  earned: number;

  @ApiPropertyOptional({ description: 'Nächstes Badge Titel falls vorhanden' })
  naechstes?: string;
}

export class AnwesenheitQuoteDto {
  @ApiProperty({ description: 'Quote 30 Tage 0–1' })
  quote30d: number;

  @ApiProperty()
  fehlTage30d: number;

  @ApiPropertyOptional({ description: 'Quote 90 Tage 0–1' })
  quote90d?: number;
}

export class SkillCoverageSummaryDto {
  @ApiProperty()
  coverage: number;

  @ApiProperty()
  freigegeben: number;

  @ApiProperty()
  used: number;
}

// ---- Typed Dashboard Results ----

export class AzubiDashboardDto {
  @ApiProperty({ example: 'azubi' })
  role: string;

  @ApiProperty({ type: OffeneBerichteDto })
  offeneBerichte: OffeneBerichteDto;

  @ApiProperty({ type: SkillCoverageSummaryDto })
  skills: SkillCoverageSummaryDto;

  @ApiProperty({ type: NotenStatDto })
  noten: NotenStatDto;

  @ApiProperty({ type: ProjektPipelineDto })
  projekte: ProjektPipelineDto;

  @ApiProperty({ type: [PruefungFristDto] })
  pruefungen: PruefungFristDto[];

  @ApiProperty({ type: OnboardingQuoteDto })
  onboarding: OnboardingQuoteDto;

  @ApiProperty({ type: BadgeProgressDto })
  badges: BadgeProgressDto;

  @ApiProperty({ type: AnwesenheitQuoteDto })
  anwesenheit: AnwesenheitQuoteDto;

  @ApiProperty()
  foerderbedarfOffen: number;

  @ApiProperty({ type: [FruchwarnDto] })
  warnings: FruchwarnDto[];

  // compatibility: also allow stats map
  @ApiPropertyOptional({ description: 'Legacy stats map für Abwärtskompatibilität' })
  stats?: Record<string, number>;
}

export class BeauftragterDashboardDto {
  @ApiProperty({ example: 'ausbildungsbeauftragter' })
  role: string;

  @ApiProperty()
  openVisa: number;

  @ApiProperty({ type: AmpelStatusDto, description: 'Visa Alter Ampel' })
  visaAmpel: AmpelStatusDto;

  @ApiProperty()
  kommendeRotationen30d: number;

  @ApiProperty()
  kommendeRotationen90d: number;

  @ApiProperty({ type: [Object], description: 'Liste [{azubiId,name,abteilung,von}]' })
  rotationen: Array<{ azubiId: string; name: string; abteilung: string; von: Date }>;

  @ApiProperty({ description: 'Gruppen Notenschnitt gewichtet' })
  gruppenNotenSchnitt: number;

  @ApiProperty()
  warnCount: number;

  @ApiProperty()
  foerderbedarfOffen: number;

  @ApiProperty()
  feedbackAvgFachkompetenz: number;

  @ApiProperty()
  feedbackAvgSoftskills: number;

  @ApiProperty()
  abwesenheiten30d: number;

  @ApiProperty({ type: [FruchwarnDto] })
  warnings: FruchwarnDto[];

  @ApiPropertyOptional()
  stats?: Record<string, number>;
}

export class AusbilderHrDashboardDto {
  @ApiProperty({ example: 'ausbilder_hr' })
  role: string;

  @ApiProperty()
  azubiGesamt: number;

  @ApiProperty({ type: Object, description: 'Verteilung {entwurf, eingereicht, visiert, archiviert}' })
  berichtVerteilung: Record<string, number>;

  @ApiProperty({ type: ProjektPipelineDto })
  projektPipeline: ProjektPipelineDto;

  @ApiProperty({ type: Object, description: 'Prüfungspipeline {angemeldet,teilgenommen,bestanden,wiederholung}' })
  pruefungPipeline: Record<string, number>;

  @ApiProperty({ type: Object, description: 'Foerderbedarf {offen,erledigt,nachverfolgungFaellig}' })
  foerderbedarf: Record<string, number>;

  @ApiProperty({ type: OnboardingQuoteDto })
  onboarding: OnboardingQuoteDto;

  @ApiProperty({ description: 'Average badges per azubi' })
  gamificationCoverage: number;

  @ApiProperty({ type: AnwesenheitQuoteDto })
  abwesenheitRate: AnwesenheitQuoteDto;

  @ApiProperty({ type: [Object], description: 'Kapazitätswarnungen [{abteilungId,name,planAusbilder,istAzubis,status}]' })
  kapazitaetWarnungen: Array<{
    abteilungId: string;
    name: string;
    planAusbilder: number;
    istAzubis: number;
    status: string;
  }>;

  @ApiPropertyOptional({ type: Object, description: 'Nur HR: uebernahmePipeline' })
  uebernahmePipeline?: Record<string, number>;

  @ApiPropertyOptional({ type: Object, description: 'Nur HR: alumniQuote' })
  alumniQuote?: Record<string, number>;

  @ApiProperty()
  notenSchnitt: number;

  @ApiProperty({ type: [FruchwarnDto] })
  warnings: FruchwarnDto[];

  @ApiPropertyOptional()
  stats?: Record<string, number>;
}

export type TypedDashboardResult =
  | AzubiDashboardDto
  | BeauftragterDashboardDto
  | AusbilderHrDashboardDto;
