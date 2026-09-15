export function getWeek(date) {
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
export default { getWeek };
//# sourceMappingURL=date-utils.js.map