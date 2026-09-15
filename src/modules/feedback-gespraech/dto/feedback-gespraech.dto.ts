import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export enum FeedbackGespraechTyp { regelmaessig='regelmaessig', anlassbezogen='anlassbezogen', probezeit='probezeit', uebernahme='uebernahme' }
export enum FeedbackGespraechStatus { geplant='geplant', durchgefuehrt='durchgefuehrt', dokumentiert='dokumentiert', nachverfolgt='nachverfolgt' }

export class CreateFeedbackGespraechDto {
  @ApiProperty() @IsUUID() azubiId: string;
  @ApiProperty({ enum: FeedbackGespraechTyp }) @IsEnum(FeedbackGespraechTyp) typ: FeedbackGespraechTyp;
  @ApiPropertyOptional() @IsOptional() @IsDateString() termin?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(2000) ziele?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() sichtbarkeitAzubi?: boolean;
}
export class UpdateFeedbackGespraechDto {
  @ApiPropertyOptional({ enum: FeedbackGespraechStatus }) @IsOptional() @IsEnum(FeedbackGespraechStatus) status?: FeedbackGespraechStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() verlaufsnotiz?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ziele?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() durchgefuehrtAm?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() sichtbarkeitAzubi?: boolean;
}
export class CreateVereinbarungDto {
  @ApiProperty() @IsString() @MaxLength(1000) text: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() faelligAm?: string;
}
