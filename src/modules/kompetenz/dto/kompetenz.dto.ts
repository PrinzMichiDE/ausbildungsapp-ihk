import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, Min, Max } from 'class-validator';

export class CreateKompetenzprofilDto {
  @ApiProperty({ isArray: true, example: ['Systemintegration', 'Netzwerktechnik'] })
  @IsArray()
  @IsString({ each: true })
  fachkompetenzen: string[];

  @ApiProperty({ isArray: true, example: ['Kommunikation', 'Teamarbeit'] })
  @IsArray()
  @IsString({ each: true })
  sozialkompetenzen: string[];

  @ApiProperty({ required: false, isArray: true, example: ['Führungskompetenz'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  staerken?: string[];

  @ApiProperty({ required: false, isArray: true, example: ['Zeitmanagement'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schwaechen?: string[];
}

export class KompetenzprofilResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ isArray: true })
  fachkompetenzen: string[];

  @ApiProperty({ isArray: true })
  sozialkompetenzen: string[];

  @ApiProperty({ nullable: true, isArray: true })
  staerken: string[] | null;

  @ApiProperty({ nullable: true, isArray: true })
  schwaechen: string[] | null;
}

export class UpdateKompetenzprofilDto extends PartialType(CreateKompetenzprofilDto) {}

export class BewerteKompetenzDto {
  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(5)
  bewertung: number;

  @ApiProperty({ required: false, example: 'Sehr gute Leistung in der Systemintegration' })
  @IsOptional()
  @IsString()
  kommentar?: string;
}
