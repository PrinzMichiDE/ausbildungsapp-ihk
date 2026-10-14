/**
 * Pure helpers for weekly report capture: ISO week dates, JArbSchG-aware
 * daily/weekly limits and validation of day/activity input. No I/O, so the
 * rules are unit-testable and shared by save and submit.
 */

export type ReportDayArtValue =
  | 'betrieb'
  | 'berufsschule'
  | 'schulung'
  | 'urlaub'
  | 'krank'
  | 'feiertag';

export const ABSENCE_DAY_ARTEN: ReadonlySet<ReportDayArtValue> = new Set([
  'urlaub',
  'krank',
  'feiertag',
]);

const WORKING_DAYS_PER_WEEK = 5;
const DAYS_PER_WEEK = 7;
const MS_PER_DAY = 86_400_000;
const ADULT_AGE = 18;

export interface ReportLimits {
  maxMinutesPerDay: number;
  maxMinutesPerDayMinor: number;
  maxMinutesPerWeekMinor: number;
}

export interface WeekDayInput {
  datum: string;
  art: ReportDayArtValue;
  aktivitaeten: ReadonlyArray<{ dauerMinuten: number }>;
}

export type WeekValidationCode =
  | 'REPORT_DAY_LIMIT_EXCEEDED'
  | 'REPORT_WEEK_LIMIT_EXCEEDED'
  | 'REPORT_INVALID_DAY'
  | 'REPORT_INCOMPLETE';

export interface WeekValidationError {
  code: WeekValidationCode;
  message: string;
  datum?: string;
  fehlendeTage?: string[];
}

export interface DaySummary {
  datum: string;
  summeMinuten: number;
  maxMinuten: number;
}

export interface WeekValidationResult {
  errors: WeekValidationError[];
  tage: DaySummary[];
  summeMinuten: number;
  maxMinutenWoche: number | null;
}

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcDate(year: number, monthIndex: number, day: number): Date {
  return new Date(Date.UTC(year, monthIndex, day));
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function weeksInIsoYear(year: number): number {
  // A year has 53 ISO weeks if 28 December falls into week 53.
  const dec28 = utcDate(year, 11, 28);
  const thursday = addDays(dec28, 3 - ((dec28.getUTCDay() + 6) % 7));
  const jan1 = utcDate(thursday.getUTCFullYear(), 0, 1);
  return Math.ceil(((thursday.getTime() - jan1.getTime()) / MS_PER_DAY + 1) / 7);
}

/** Monday and Sunday (UTC midnight) of the given ISO week. */
export function isoWeekRange(jahr: number, kalenderwoche: number): { montag: Date; sonntag: Date } {
  if (!Number.isInteger(kalenderwoche) || kalenderwoche < 1 || kalenderwoche > weeksInIsoYear(jahr)) {
    throw new RangeError(`KW ${kalenderwoche} existiert im Jahr ${jahr} nicht`);
  }
  const jan4 = utcDate(jahr, 0, 4);
  const week1Monday = addDays(jan4, -((jan4.getUTCDay() + 6) % 7));
  const montag = addDays(week1Monday, (kalenderwoche - 1) * DAYS_PER_WEEK);
  return { montag, sonntag: addDays(montag, DAYS_PER_WEEK - 1) };
}

/** All seven dates (YYYY-MM-DD) of the ISO week, Monday first. */
export function isoWeekDays(jahr: number, kalenderwoche: number): string[] {
  const { montag } = isoWeekRange(jahr, kalenderwoche);
  return Array.from({ length: DAYS_PER_WEEK }, (_, i) => toIsoDate(addDays(montag, i)));
}

/** Completed years on the given date; 29 Feb birthdays count from 1 March in non-leap years. */
export function ageOnDate(geburtsdatum: string, datum: string): number {
  const [by, bm, bd] = geburtsdatum.split('-').map(Number);
  const [y, m, d] = datum.split('-').map(Number);
  const birthdayReached = m > bm || (m === bm && d >= bd);
  return y - by - (birthdayReached ? 0 : 1);
}

function isMinorOn(geburtsdatum: string | null, datum: string): boolean {
  return geburtsdatum !== null && ageOnDate(geburtsdatum, datum) < ADULT_AGE;
}

/** Daily limit for the given day; without a birth date the adult limit applies. */
export function dailyLimitMinutes(
  geburtsdatum: string | null,
  datum: string,
  limits: ReportLimits,
): number {
  return isMinorOn(geburtsdatum, datum) ? limits.maxMinutesPerDayMinor : limits.maxMinutesPerDay;
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export const DAY_ART_LABELS: Readonly<Record<ReportDayArtValue, string>> = {
  betrieb: 'Betrieb',
  berufsschule: 'Berufsschule',
  schulung: 'Schulung',
  urlaub: 'Urlaub',
  krank: 'Krank',
  feiertag: 'Feiertag',
};

export interface RenderableDay {
  datum: string;
  art: ReportDayArtValue;
  aktivitaeten: ReadonlyArray<{ beschreibung: string; dauerMinuten: number; taskTitel?: string | null }>;
}

/**
 * Plain-text/markdown rendering of the week. Used for versions, diff and the
 * PDF so they keep working on top of the structured day entries.
 */
export function renderWeekMarkdown(tage: ReadonlyArray<RenderableDay>): string {
  const sorted = [...tage].sort((a, b) => a.datum.localeCompare(b.datum));
  const lines: string[] = [];
  let woche = 0;
  for (const tag of sorted) {
    const summe = tag.aktivitaeten.reduce((acc, a) => acc + a.dauerMinuten, 0);
    woche += summe;
    lines.push(`## ${formatGermanDay(tag.datum)} – ${DAY_ART_LABELS[tag.art]} (${formatMinutes(summe)})`);
    for (const a of tag.aktivitaeten) {
      const task = a.taskTitel ? ` [Task: ${a.taskTitel}]` : '';
      lines.push(`- ${formatMinutes(a.dauerMinuten)} ${a.beschreibung}${task}`);
    }
    lines.push('');
  }
  lines.push(`Gesamt: ${formatMinutes(woche)}`);
  return lines.join('\n');
}

function formatGermanDay(datum: string): string {
  const weekday = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][new Date(`${datum}T00:00:00Z`).getUTCDay()];
  const [, m, d] = datum.split('-');
  return `${weekday} ${d}.${m}.`;
}

export function validateWeek(
  tage: ReadonlyArray<WeekDayInput>,
  weekDays: ReadonlyArray<string>,
  geburtsdatum: string | null,
  limits: ReportLimits,
  options: { requireComplete?: boolean } = {},
): WeekValidationResult {
  const errors: WeekValidationError[] = [];
  const allowed = new Set(weekDays);
  const seen = new Set<string>();
  const summaries: DaySummary[] = [];

  for (const tag of tage) {
    const label = formatGermanDay(tag.datum);
    if (!allowed.has(tag.datum)) {
      errors.push({ code: 'REPORT_INVALID_DAY', datum: tag.datum, message: `${tag.datum} liegt nicht in der Berichtswoche` });
      continue;
    }
    if (seen.has(tag.datum)) {
      errors.push({ code: 'REPORT_INVALID_DAY', datum: tag.datum, message: `${label} ist doppelt angegeben` });
      continue;
    }
    seen.add(tag.datum);

    const summe = tag.aktivitaeten.reduce((acc, a) => acc + a.dauerMinuten, 0);
    const max = dailyLimitMinutes(geburtsdatum, tag.datum, limits);
    summaries.push({ datum: tag.datum, summeMinuten: summe, maxMinuten: max });

    if (ABSENCE_DAY_ARTEN.has(tag.art) && tag.aktivitaeten.length > 0) {
      errors.push({ code: 'REPORT_INVALID_DAY', datum: tag.datum, message: `${label}: an Abwesenheitstagen (${tag.art}) sind keine Aktivitäten erlaubt` });
    }
    if (summe > max) {
      const grund = isMinorOn(geburtsdatum, tag.datum) ? ' (Jugendarbeitsschutz)' : '';
      errors.push({
        code: 'REPORT_DAY_LIMIT_EXCEEDED',
        datum: tag.datum,
        message: `${label}: ${formatMinutes(summe)} überschreitet ${formatMinutes(max)}${grund}`,
      });
    }
  }

  const summeMinuten = summaries.reduce((acc, s) => acc + s.summeMinuten, 0);
  const minorThisWeek = weekDays.some((d) => isMinorOn(geburtsdatum, d));
  const maxMinutenWoche = minorThisWeek ? limits.maxMinutesPerWeekMinor : null;
  if (maxMinutenWoche !== null && summeMinuten > maxMinutenWoche) {
    errors.push({
      code: 'REPORT_WEEK_LIMIT_EXCEEDED',
      message: `Woche: ${formatMinutes(summeMinuten)} überschreitet ${formatMinutes(maxMinutenWoche)} (Jugendarbeitsschutz)`,
    });
  }

  if (options.requireComplete) {
    const byDate = new Map(tage.map((t) => [t.datum, t]));
    const fehlendeTage = weekDays.slice(0, WORKING_DAYS_PER_WEEK).filter((d) => {
      const t = byDate.get(d);
      return !t || (!ABSENCE_DAY_ARTEN.has(t.art) && t.aktivitaeten.length === 0);
    });
    if (fehlendeTage.length > 0) {
      errors.push({
        code: 'REPORT_INCOMPLETE',
        fehlendeTage,
        message: `Ohne Aktivität oder Abwesenheit: ${fehlendeTage.map(formatGermanDay).join(', ')}`,
      });
    }
  }

  return { errors, tage: summaries, summeMinuten, maxMinutenWoche };
}
