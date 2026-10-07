import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean, IsUUID, IsDateString, Min, Max } from 'class-validator';
import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart, ReportStatus } from '@prisma/client';
import { WarnTyp } from './reporting.dto.js';

export class AzubiDashboardDto {
  @ApiProperty()
  role: 'azubi';

  @ApiProperty({ description: 'Offene Berichte nach Ampel' })
  offeneBerichte: {
    gesamt: number;
    ampel: {
      gruen: number;
      gelb: number;
      rot: number;
    };
  };

  @ApiProperty({ description: 'Skill Matrix Coverage' })
  skillCoverage: {
    frei: number;
    used: number;
    coverage: number;
  };

  @ApiProperty({ description: 'Noten-Zeitreihe' })
  noten: {
    anzahl: number;
    schnittGewichtet: number;
    halbjahrTrends: {
      halbjahr: Halbjahr;
      schnitt: number;
      fach: string;
    }[];
    verteilung: {
      note1: number;
      note2: number;
      note3: number;
      note4: number;
      note5: number;
      note6: number;
    };
  };

  @ApiProperty({ description: 'Projekte-Pipeline' })
  projekte: {
    entwurf: number;
    eingereicht: number;
    freigegeben: number;
    abgelehnt: number;
  };

  @ApiProperty({ description: 'Pruefungen' })
  pruefungen: {
    naechsteFristen: {
      id: string;
      typ: string;
      frist: Date;
      status: string;
    }[];
  };

  @ApiProperty({ description: 'Onboarding' })
  onboarding: {
    erledigt: number;
    quote: number;
    naechstes: string;
  };

  @ApiProperty({ description: 'Badges' })
  badges: {
    gesamt: number;
    naechstes: string;
  };

  @ApiProperty({ description: 'Abwesenheit' })
  anwesenheit: {
    quote30d: number;
    fehlTage30d: number;
  };

  @ApiProperty({ description: 'Foerderbedarf offen' })
  foerderbedarfOffen: number;

  @ApiProperty()
  stats: Record<string, number>;

  @ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } })
  warnings: any[];
}

export class BeauftragterDashboardDto {
  @ApiProperty()
  role: 'ausbildungsbeauftragter';

  @ApiProperty({ description: 'Visa-Antraege nach Ampel' })
  offeneVisa: {
    gesamt: number;
    ampel: {
      gruen: number;
      gelb: number;
      rot: number;
    };
  };

  @ApiProperty({ description: 'Rotationen' })
  rotationen: {
    naechste30d: number;
    naechste90d: number;
    liste: {
      azubiId: string;
      name: string;
      abteilung: string;
      von: Date;
      bis: Date;
    }[];
  };

  @ApiProperty({ description: 'Skill Coverage nur scoped' })
  skillCoverage: {
    courses: {
      courseId: string;
      courseTitle: string;
      used: number;
      total: number;
      coverage: number;
    }[];
  };

  @ApiProperty({ description: 'Noten statistisch' })
  noten: {
    schnittGewichtet: number;
    verteilung: {
      note1: number;
      note2: number;
      note3: number;
      note4: number;
      note5: number;
      note6: number;
    };
  };

  @ApiProperty({ description: 'Foerderbedarf offen' })
  foerderbedarfOffen: number;

  @ApiProperty({ description: 'Feedback' })
  feedback: {
    abteilung: {
      abteilungId: string;
      avgFachkompetenz: number;
      avgSoftskills: number;
    }[];
  };

  @ApiProperty({ description: 'Abwesenheiten Abteilung' })
  abwesenheiten: {
    count30d: number;
  };

  @ApiProperty()
  stats: Record<string, number>;

  @ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } })
  warnings: any[];
}

export class AusbilderHrDashboardDto {
  @ApiProperty()
  role: 'ausbilder' | 'hr';

  @ApiProperty({ description: 'Berichtsheft-Verteilung' })
  berichtVerteilung: {
    entwurf: number;
    eingereicht: number;
    visiert: number;
    archiviert: number;
  };

  @ApiProperty({ description: 'Projekt-Pipeline' })
  projektPipeline: {
    entwurf: number;
    eingereicht: number;
    freigegeben: number;
    abgelehnt: number;
  };

  @ApiProperty({ description: 'Pruefung-Pipeline' })
  pruefungPipeline: {
    angemeldet: number;
    teilgenommen: number;
    bestanden: number;
    wiederholung: number;
  };

  @ApiProperty({ description: 'Foerderbedarf' })
  foerderbedarf: {
    offen: number;
    erledigt: number;
    nachverfolgungFaellig: number;
  };

  @ApiProperty({ description: 'Onboarding Coverage' })
  onboardingQuote: {
    erledigt: number;
    gesamt: number;
  };

  @ApiProperty({ description: 'Gamification' })
  gamificationCoverage: {
    badgesAvg: number;
    topBadgeCount: number;
  };

  @ApiProperty({ description: 'Abwesenheitsrate' })
  abwesenheitRate: {
    rate30d: number;
    rate90d: number;
  };

  @ApiProperty({ description: 'Kapazitaetswarnungen' })
  kapazitaetWarnung: {
    abteilungen: {
      abteilungId: string;
      name: string;
      planAusbilder: number;
      istAusbilder: number;
      status: 'OK' | 'WARNUNG' | 'KRITISCH';
    }[];
  };

  @ApiProperty({ description: 'HR-spezifische Daten' })
  uebernahmePipeline: {
    geplant: number;
    geblockt: number;
    abgeschlossen: number;
    widerrufen: number;
  };

  @ApiProperty({ description: 'Alumni-Statistiken' })
  alumni: {
    ausgetreten30d: number;
    loeschungFaellig: number;
  };

  @ApiProperty()
  stats: Record<string, number>;

  @ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } })
  warnings: any[];
}

export class SkillGapDto {
  @ApiProperty()
  lernfeld: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty()
  tasksTotal: number;

  @ApiProperty()
  reportsUsing: number;

  @ApiProperty({ description: '0-1' })
  coverage: number;

  @ApiProperty()
  istStunden: number;

  @ApiProperty({ description: 'Fehlende Tasks' })
  fehlendeTasks: string[];

  @ApiProperty({ description: 'Priorität' })
  priorität: 'hoch' | 'mittel' | 'niedrig';
}

export class NotenTrendDto {
  @ApiProperty()
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
  @ApiProperty()
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
  avgAbbruchquote: number;

  @ApiProperty()
  trendNotenSchnitt: number;

  @ApiProperty()
  trendReportQuote: number;
}

export class CourseCompletionDto {
  @ApiProperty()
  courseId: string;

  @ApiProperty()
  courseTitle: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty({ description: '0-1' })
  completionRate: number;

  @ApiProperty({ description: 'Time to completion in days' })
  timeToCompletion: {
    avg: number;
    median: number;
  };

  @ApiProperty({ description: 'Qualitäts-Score Verteilung' })
  qualitaetsScoreDistribution: {
    avg: number;
    histogram: {
      range0_50: number;
      range51_70: number;
      range71_85: number;
      range86_100: number;
    };
  };
}

export class AlertConfigDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: WarnTyp })
  typ: WarnTyp;

  @ApiProperty()
  schwelle: Record<string, unknown>;

  @ApiProperty()
  aktiv: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CustomReportDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  metrics: string[];

  @ApiProperty()
  timeframe: {
    von?: string;
    bis?: string;
    halbjahr?: string;
  };

  @ApiProperty()
  visualizations: string[];

  @ApiProperty()
  filters: {
    abteilungId?: string;
    beruf?: string;
    halbjahr?: string;
  };

  @ApiProperty()
  createdAt: Date;
}

export class DashboardResult {
  @ApiProperty()
  role: string;

@ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  stats: Record<string, number>;

  @ApiProperty({ type: 'array', items: { type: 'object', additionalProperties: true } })
  warnings: any[];
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
