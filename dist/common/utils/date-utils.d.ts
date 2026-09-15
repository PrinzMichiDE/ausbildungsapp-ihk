export declare function getWeek(date: Date): number;
declare global {
    interface Date {
        getWeek(): number;
    }
}
declare const _default: {
    getWeek: typeof getWeek;
};
export default _default;
