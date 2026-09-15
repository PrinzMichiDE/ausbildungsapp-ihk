export declare enum CustomMetric {
    reportQuote = "reportQuote",
    skillGap = "skillGap",
    notenTrend = "notenTrend",
    warnliste = "warnliste",
    kohorten = "kohorten",
    courseCompletion = "courseCompletion",
    zeitreihe = "zeitreihe"
}
export declare enum VisualizationType {
    bar = "bar",
    line = "line",
    pie = "pie",
    table = "table"
}
export declare class CreateCustomReportDto {
    name: string;
    metrics: CustomMetric[];
    visualizations?: VisualizationType[];
    timeframe?: Record<string, string>;
    filters?: Record<string, string>;
}
export declare class CustomReportResponseDto {
    id: string;
    name: string;
    metrics: string[];
    timeframe: Record<string, string> | null;
    filters: Record<string, string> | null;
    visualizations: string[];
    createdBy: string;
    createdAt: Date;
}
