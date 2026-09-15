import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export enum CustomMetric {
  reportQuote = 'reportQuote',
  skillGap = 'skillGap',
  notenTrend = 'notenTrend',
  warnliste = 'warnliste',
  kohorten = 'kohorten',
  courseCompletion = 'courseCompletion',
  zeitreihe = 'zeitreihe',
}

export enum VisualizationType {
  bar = 'bar',
  line = 'line',
  pie = 'pie',
  table = 'table',
}

export class CreateCustomReportDto {
  @ApiProperty({ example: 'Mein Quartalsreport' })
  @IsString()
  name: string;

  @ApiProperty({ enum: CustomMetric, isArray: true, example: [CustomMetric.reportQuote, CustomMetric.notenTrend] })
  @IsArray()
  @IsEnum(CustomMetric, { each: true })
  metrics: CustomMetric[];

  @ApiPropertyOptional({ description: 'Visualisierung je Metric', enum: VisualizationType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(VisualizationType, { each: true })
  visualizations?: VisualizationType[];

  @ApiPropertyOptional({ type: Object, description: 'Timeframe {von,bis,jahrFrom,jahrTo}' })
  @IsOptional()
  timeframe?: Record<string, string>;

  @ApiPropertyOptional({ type: Object, description: 'Filter {abteilungId, beruf, fach}' })
  @IsOptional()
  filters?: Record<string, string>;
}

export class CustomReportResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: CustomMetric, isArray: true })
  metrics: string[];

  @ApiProperty({ type: Object, nullable: true })
  timeframe: Record<string, string> | null;

  @ApiProperty({ type: Object, nullable: true })
  filters: Record<string, string> | null;

  @ApiProperty({ enum: VisualizationType, isArray: true })
  visualizations: string[];

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;
}
