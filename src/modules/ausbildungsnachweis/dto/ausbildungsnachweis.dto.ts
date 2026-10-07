import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { AusbildungsnachweisStatus } from '../../../common/enums/ausbildungsmanagement.enums.js';

export class CreateAusbildungsnachweisDto {
  @ApiProperty({ example: 'Zwischenzeugnis - Q2' })
  @IsString()
  titel: string;

  @ApiProperty({ example: 'Der Azubi hat folgende Leistungen erbracht...' })
  @IsString()
  inhaltMarkdown: string;

  @ApiProperty({ required: false, example: 'systemintegration' })
  @IsOptional()
  @IsString()
  beruf?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rahmenlehrplanId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  anhaenge?: string[];
}

export class AusbildungsnachweisResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty({ required: false, example: 'systemintegration' })
  beruf?: string;

  @ApiProperty({ example: 'Zwischenzeugnis - Q2' })
  titel: string;

  @ApiProperty({ example: 'Der Azubi hat folgende Leistungen erbracht...' })
  inhaltMarkdown: string;

  @ApiProperty({ example: 'entwurf' })
  status: string;

  @ApiProperty({ required: false })
  signiertVon?: string | null;

  @ApiProperty({ required: false })
  signiertAm?: Date | null;

  @ApiProperty({ required: false })
  archiviertAm?: Date | null;

  @ApiProperty({ required: false })
  rahmenlehrplanId?: string | null;

  @ApiProperty()
  erstelltAm: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UpdateAusbildungsnachweisDto extends PartialType(CreateAusbildungsnachweisDto) {}

export class AddCommentDto {
  @ApiProperty({ example: 'Gut dokumentiert' })
  @IsString()
  text: string;

  @ApiProperty({ required: false, example: 'allgemein' })
  @IsOptional()
  @IsString()
  art?: string;
}

export class AddVersionDto {
  @ApiProperty({ example: 'entwurf' })
  @IsString()
  inhaltMarkdown: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}