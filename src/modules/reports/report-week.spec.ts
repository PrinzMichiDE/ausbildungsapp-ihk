import { describe, expect, it } from 'vitest';
import {
  ageOnDate,
  dailyLimitMinutes,
  formatMinutes,
  isoWeekDays,
  isoWeekRange,
  renderWeekMarkdown,
  toIsoDate,
  validateWeek,
  type ReportLimits,
  type WeekDayInput,
} from './report-week.js';

const LIMITS: ReportLimits = {
  maxMinutesPerDay: 600,
  maxMinutesPerDayMinor: 480,
  maxMinutesPerWeekMinor: 2400,
};

const day = (
  datum: string,
  minuten: number[] = [],
  art: WeekDayInput['art'] = 'betrieb',
): WeekDayInput => ({
  datum,
  art,
  aktivitaeten: minuten.map((dauerMinuten) => ({ dauerMinuten })),
});

describe('isoWeekRange', () => {
  it('returns Monday to Sunday of a regular week', () => {
    const { montag, sonntag } = isoWeekRange(2026, 42);
    expect(toIsoDate(montag)).toBe('2026-10-12');
    expect(toIsoDate(sonntag)).toBe('2026-10-18');
  });

  it('handles week 1 starting in the previous year', () => {
    expect(toIsoDate(isoWeekRange(2026, 1).montag)).toBe('2025-12-29');
  });

  it('handles week 53 in long years', () => {
    expect(toIsoDate(isoWeekRange(2026, 53).montag)).toBe('2026-12-28');
  });

  it('rejects week 53 in years with only 52 weeks', () => {
    expect(() => isoWeekRange(2025, 53)).toThrow();
  });
});

describe('isoWeekDays', () => {
  it('returns seven consecutive ISO dates starting Monday', () => {
    expect(isoWeekDays(2026, 42)).toEqual([
      '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15',
      '2026-10-16', '2026-10-17', '2026-10-18',
    ]);
  });
});

describe('ageOnDate / dailyLimitMinutes', () => {
  it('is not yet 18 the day before the birthday', () => {
    expect(ageOnDate('2008-10-14', '2026-10-13')).toBe(17);
  });

  it('is 18 on the birthday', () => {
    expect(ageOnDate('2008-10-14', '2026-10-14')).toBe(18);
  });

  it('treats 29 February birthdays as reached on 1 March in non-leap years', () => {
    expect(ageOnDate('2008-02-29', '2026-02-28')).toBe(17);
    expect(ageOnDate('2008-02-29', '2026-03-01')).toBe(18);
  });

  it('applies the minor limit before the 18th birthday and the adult limit from it', () => {
    expect(dailyLimitMinutes('2008-10-14', '2026-10-13', LIMITS)).toBe(480);
    expect(dailyLimitMinutes('2008-10-14', '2026-10-14', LIMITS)).toBe(600);
  });

  it('falls back to the adult limit when no birth date is known', () => {
    expect(dailyLimitMinutes(null, '2026-10-14', LIMITS)).toBe(600);
  });
});

describe('formatMinutes', () => {
  it.each([
    [0, '00:00'],
    [5, '00:05'],
    [150, '02:30'],
    [600, '10:00'],
    [2400, '40:00'],
  ])('%i -> %s', (input, expected) => {
    expect(formatMinutes(input)).toBe(expected);
  });
});

describe('renderWeekMarkdown', () => {
  it('renders days sorted by date with activity durations, task titles and totals', () => {
    const md = renderWeekMarkdown([
      { datum: '2026-10-13', art: 'urlaub', aktivitaeten: [] },
      {
        datum: '2026-10-12',
        art: 'betrieb',
        aktivitaeten: [
          { beschreibung: 'Switch konfiguriert', dauerMinuten: 150, taskTitel: 'VLAN einrichten' },
          { beschreibung: 'Tickets', dauerMinuten: 285 },
        ],
      },
    ]);
    expect(md).toBe(
      [
        '## Mo 12.10. – Betrieb (07:15)',
        '- 02:30 Switch konfiguriert [Task: VLAN einrichten]',
        '- 04:45 Tickets',
        '',
        '## Di 13.10. – Urlaub (00:00)',
        '',
        'Gesamt: 07:15',
      ].join('\n'),
    );
  });
});

describe('validateWeek', () => {
  const week = isoWeekDays(2026, 42);

  it('accepts a day exactly at the daily limit', () => {
    const result = validateWeek([day(week[0], [300, 300])], week, null, LIMITS);
    expect(result.errors).toEqual([]);
    expect(result.tage[0]).toMatchObject({ summeMinuten: 600, maxMinuten: 600 });
  });

  it('rejects a day one minute over the daily limit', () => {
    const result = validateWeek([day(week[0], [300, 301])], week, null, LIMITS);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({ code: 'REPORT_DAY_LIMIT_EXCEEDED', datum: week[0] });
  });

  it('uses the minor limit per day for under-18s', () => {
    const result = validateWeek([day(week[0], [481])], week, '2010-01-01', LIMITS);
    expect(result.errors[0]).toMatchObject({ code: 'REPORT_DAY_LIMIT_EXCEEDED' });
    expect(result.errors[0].message).toContain('Jugendarbeitsschutz');
  });

  it('enforces the weekly limit for minors', () => {
    const tage = week.slice(0, 5).map((d) => day(d, [480]));
    tage.push(day(week[5], [5]));
    const result = validateWeek(tage, week, '2010-01-01', LIMITS);
    expect(result.errors.map((e) => e.code)).toContain('REPORT_WEEK_LIMIT_EXCEEDED');
    expect(result.summeMinuten).toBe(2405);
  });

  it('does not enforce a weekly limit for adults', () => {
    const tage = week.slice(0, 6).map((d) => day(d, [480]));
    expect(validateWeek(tage, week, null, LIMITS).errors).toEqual([]);
  });

  it('rejects activities on absence days', () => {
    const result = validateWeek([day(week[0], [60], 'urlaub')], week, null, LIMITS);
    expect(result.errors[0]).toMatchObject({ code: 'REPORT_INVALID_DAY', datum: week[0] });
  });

  it('rejects dates outside the report week', () => {
    const result = validateWeek([day('2026-10-19', [60])], week, null, LIMITS);
    expect(result.errors[0]).toMatchObject({ code: 'REPORT_INVALID_DAY' });
  });

  it('rejects duplicate dates', () => {
    const result = validateWeek([day(week[0]), day(week[0])], week, null, LIMITS);
    expect(result.errors[0]).toMatchObject({ code: 'REPORT_INVALID_DAY' });
  });

  describe('completeness (submit)', () => {
    it('lists working days without activities and without absence', () => {
      const tage = [
        day(week[0], [60]),
        day(week[1], [], 'krank'),
        day(week[2]),
      ];
      const result = validateWeek(tage, week, null, LIMITS, { requireComplete: true });
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({ code: 'REPORT_INCOMPLETE' });
      expect(result.errors[0].fehlendeTage).toEqual([week[2], week[3], week[4]]);
    });

    it('passes when every working day has activities or an absence', () => {
      const tage = [
        day(week[0], [60]),
        day(week[1], [], 'urlaub'),
        day(week[2], [60]),
        day(week[3], [], 'feiertag'),
        day(week[4], [60]),
      ];
      expect(validateWeek(tage, week, null, LIMITS, { requireComplete: true }).errors).toEqual([]);
    });
  });
});
