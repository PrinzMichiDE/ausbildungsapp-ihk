import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjektDto {
  @ApiProperty({ example: 'Abschlussprojekt: Microservices-Architektur' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ required: false, example: 'Entwurf eines Microservices-basierten Systems' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  beschreibung?: string;

  @ApiProperty({ required: false, example: 'Der Projektantrag beschreibt ...' })
  @IsOptional()
  @IsString()
  projektantrag?: string;

  @ApiProperty({ required: false, example: 'Dokumentation des Projektergebnisses' })
  @IsOptional()
  @IsString()
  projektdoku?: string;
}

export class UpdateProjektDto extends PartialType(CreateProjektDto) {}

export class ProjektResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  titel: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  projektantrag: string | null;

  @ApiProperty({ nullable: true })
  projektdoku: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  bewertung: string | null;

  @ApiProperty({ nullable: true })
  bewertetVon: string | null;

  @ApiProperty({ nullable: true })
  bewertetAm: Date | null;

  @ApiProperty()
  freigegeben: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}