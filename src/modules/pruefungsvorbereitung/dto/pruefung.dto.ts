import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, MinLength } from 'class-validator';

export class CreatePruefungssimulationDto {
  @ApiProperty({ example: 'Systemintegration' })
  @IsString()
  @MinLength(2)
  beruf: string;

  @ApiProperty({ example: 'schriftlich' })
  @IsString()
  typ: string;

  @ApiProperty({ isArray: true, example: ['Aufgabe 1...', 'Aufgabe 2...'] })
  @IsArray()
  @IsString({ each: true })
  aufgaben: string[];

  @ApiProperty({ required: false, isArray: true, example: ['Lösung 1...', 'Lösung 2...'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  loesungen?: string[];

  @ApiProperty({ required: false, example: 100 })
  @IsOptional()
  @IsNumber()
  bewertung?: number;
}

export class PruefungssimulationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  beruf: string;

  @ApiProperty()
  typ: string;

  @ApiProperty({ isArray: true })
  aufgaben: string[];

  @ApiProperty({ nullable: true, isArray: true })
  loesungen: string[] | null;

  @ApiProperty({ nullable: true })
  bewertung: number | null;
}
