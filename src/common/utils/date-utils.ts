// Date utilities for NextGen IT-Ausbildung

/**
 * Add week to Date prototype
 *
 * Returns the ISO week number for the given date
 * Week 1 starts the Monday of the year containing January 4th
 *
 * @param date - The date to get the week number for
 * @returns The week number (1-53)
 */
export function getWeek(date: Date): number {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setDate(target.getDate() + (4 - target.getDay()));
  }
  const weekDiff = Math.round((firstThursday - target.valueOf()) / 86400000) / 7 + 1;
  return weekDiff;
}

declare global {
  interface Date{
    /**
     * Returns the ISO week number for the date
     * Week 1 starts the Monday of the year containing January 4th
     * @returns The week number (1-53)
     */
    getWeek(): number;
  }
}

export default { getWeek };
