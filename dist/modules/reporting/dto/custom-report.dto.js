var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
export var CustomMetric;
(function (CustomMetric) {
    CustomMetric["reportQuote"] = "reportQuote";
    CustomMetric["skillGap"] = "skillGap";
    CustomMetric["notenTrend"] = "notenTrend";
    CustomMetric["warnliste"] = "warnliste";
    CustomMetric["kohorten"] = "kohorten";
    CustomMetric["courseCompletion"] = "courseCompletion";
    CustomMetric["zeitreihe"] = "zeitreihe";
})(CustomMetric || (CustomMetric = {}));
export var VisualizationType;
(function (VisualizationType) {
    VisualizationType["bar"] = "bar";
    VisualizationType["line"] = "line";
    VisualizationType["pie"] = "pie";
    VisualizationType["table"] = "table";
})(VisualizationType || (VisualizationType = {}));
export class CreateCustomReportDto {
    name;
    metrics;
    visualizations;
    timeframe;
    filters;
}
__decorate([
    ApiProperty({ example: 'Mein Quartalsreport' }),
    IsString(),
    __metadata("design:type", String)
], CreateCustomReportDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ enum: CustomMetric, isArray: true, example: [CustomMetric.reportQuote, CustomMetric.notenTrend] }),
    IsArray(),
    IsEnum(CustomMetric, { each: true }),
    __metadata("design:type", Array)
], CreateCustomReportDto.prototype, "metrics", void 0);
__decorate([
    ApiPropertyOptional({ description: 'Visualisierung je Metric', enum: VisualizationType, isArray: true }),
    IsOptional(),
    IsArray(),
    IsEnum(VisualizationType, { each: true }),
    __metadata("design:type", Array)
], CreateCustomReportDto.prototype, "visualizations", void 0);
__decorate([
    ApiPropertyOptional({ type: Object, description: 'Timeframe {von,bis,jahrFrom,jahrTo}' }),
    IsOptional(),
    __metadata("design:type", Object)
], CreateCustomReportDto.prototype, "timeframe", void 0);
__decorate([
    ApiPropertyOptional({ type: Object, description: 'Filter {abteilungId, beruf, fach}' }),
    IsOptional(),
    __metadata("design:type", Object)
], CreateCustomReportDto.prototype, "filters", void 0);
export class CustomReportResponseDto {
    id;
    name;
    metrics;
    timeframe;
    filters;
    visualizations;
    createdBy;
    createdAt;
}
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CustomReportResponseDto.prototype, "id", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CustomReportResponseDto.prototype, "name", void 0);
__decorate([
    ApiProperty({ enum: CustomMetric, isArray: true }),
    __metadata("design:type", Array)
], CustomReportResponseDto.prototype, "metrics", void 0);
__decorate([
    ApiProperty({ type: Object, nullable: true }),
    __metadata("design:type", Object)
], CustomReportResponseDto.prototype, "timeframe", void 0);
__decorate([
    ApiProperty({ type: Object, nullable: true }),
    __metadata("design:type", Object)
], CustomReportResponseDto.prototype, "filters", void 0);
__decorate([
    ApiProperty({ enum: VisualizationType, isArray: true }),
    __metadata("design:type", Array)
], CustomReportResponseDto.prototype, "visualizations", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", String)
], CustomReportResponseDto.prototype, "createdBy", void 0);
__decorate([
    ApiProperty(),
    __metadata("design:type", Date)
], CustomReportResponseDto.prototype, "createdAt", void 0);
//# sourceMappingURL=custom-report.dto.js.map