import type { ReportDayArt, ReportStatus } from '@/stores/report'

/** Formats whole minutes as hh:mm (hours may exceed 24 for week totals). */
export function formatMinutes(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes))
  const h = Math.floor(safe / 60)
  const m = safe % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Parses user input into minutes. Accepts "2:30", "02:30", "2,5"/"2.5" (hours)
 * and a plain number of minutes ("150"). Returns null for invalid input.
 */
export function parseDuration(input: string): number | null {
  const value = input.trim()
  if (value === '') return null

  const hhmm = /^(\d{1,2}):([0-5]\d)$/.exec(value)
  if (hhmm) return Number(hhmm[1]) * 60 + Number(hhmm[2])

  const decimalHours = /^(\d{1,2})[.,](\d{1,2})$/.exec(value)
  if (decimalHours) return Math.round(Number(`${decimalHours[1]}.${decimalHours[2]}`) * 60)

  if (/^\d{1,4}$/.test(value)) return Number(value)

  return null
}

export const DAY_ART_OPTIONS: ReadonlyArray<{ value: ReportDayArt; label: string }> = [
  { value: 'betrieb', label: 'Betrieb' },
  { value: 'berufsschule', label: 'Berufsschule' },
  { value: 'schulung', label: 'Schulung' },
  { value: 'urlaub', label: 'Urlaub' },
  { value: 'krank', label: 'Krank' },
  { value: 'feiertag', label: 'Feiertag' },
]

export const ABSENCE_DAY_ARTEN: ReadonlySet<ReportDayArt> = new Set(['urlaub', 'krank', 'feiertag'])

export const STATUS_LABELS: Readonly<Record<ReportStatus, string>> = {
  entwurf: 'Entwurf',
  eingereicht: 'Eingereicht',
  in_pruefung: 'In Prüfung',
  visiert: 'Visiert',
  archiviert: 'Archiviert',
}

export const STATUS_CLASSES: Readonly<Record<ReportStatus, string>> = {
  entwurf: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  eingereicht: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  in_pruefung: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  visiert: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  archiviert: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
}

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] as const
const WEEKDAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'] as const

function utc(datum: string): Date {
  return new Date(`${datum.slice(0, 10)}T00:00:00Z`)
}

export function weekdayShort(datum: string): string {
  return WEEKDAYS[utc(datum).getUTCDay()]
}

export function weekdayLong(datum: string): string {
  return WEEKDAYS_LONG[utc(datum).getUTCDay()]
}

/** "12.10." */
export function dayMonth(datum: string): string {
  const d = utc(datum)
  return `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.`
}

/** "12.10.2026" */
export function formatDate(datum: string): string {
  return `${dayMonth(datum)}${utc(datum).getUTCFullYear()}`
}

export function isWeekend(datum: string): boolean {
  const day = utc(datum).getUTCDay()
  return day === 0 || day === 6
}

/** All seven ISO dates of the week starting at the given Monday. */
export function weekDates(montag: string): string[] {
  const start = utc(montag).getTime()
  return Array.from({ length: 7 }, (_, i) => new Date(start + i * 86_400_000).toISOString().slice(0, 10))
}

/** ISO week number and ISO week-year of a (local) date. */
export function isoWeekOf(date: Date): { kalenderwoche: number; jahr: number } {
  const thursday = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  thursday.setUTCDate(thursday.getUTCDate() + 3 - ((thursday.getUTCDay() + 6) % 7))
  const jahr = thursday.getUTCFullYear()
  const jan1 = Date.UTC(jahr, 0, 1)
  return { kalenderwoche: Math.floor((thursday.getTime() - jan1) / 86_400_000 / 7) + 1, jahr }
}

/** Monday (YYYY-MM-DD) of an ISO week. */
export function isoWeekMonday(jahr: number, kalenderwoche: number): string {
  const jan4 = new Date(Date.UTC(jahr, 0, 4))
  const week1Monday = jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86_400_000
  return new Date(week1Monday + (kalenderwoche - 1) * 7 * 86_400_000).toISOString().slice(0, 10)
}
