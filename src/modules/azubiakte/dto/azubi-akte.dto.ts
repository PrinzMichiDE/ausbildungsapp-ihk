import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AzubiAkteResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Max Mustermann' })
  name: string;

  @ApiProperty({ example: 'max.mustermann@nextgen.de' })
  email: string;

  @ApiProperty({ required: false, example: 'systemintegration' })
  beruf?: string;

  @ApiProperty({ required: false, example: '2026-09-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  vertragsStart?: Date;

  @ApiProperty({ required: false, example: '2029-08-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  vertragsEnde?: Date;

  @ApiProperty({ required: false, example: 'entwurf' })
  @IsOptional()
  @IsString()
  planStatus?: string;

  @ApiProperty({ required: false, example: 3 })
  @IsOptional()
  nachweiseCount?: number;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  einsaetzeCount?: number;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  abwesenheitenCount?: number;
}

export class AzubiAkteOverviewDto {
  @ApiProperty({ example: 42 })
  totalAzubis: number;

  @ApiProperty({ example: 15 })
  aktiveVertraege: number;

  @ApiProperty({ example: 120 })
  gesamtNachweise: number;

  @ApiProperty({ example: 8 })
  inPruefung: number;
}