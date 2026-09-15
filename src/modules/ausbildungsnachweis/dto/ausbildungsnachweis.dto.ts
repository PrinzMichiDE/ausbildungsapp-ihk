import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength } from 'class-validator';
import { AusbildungsnachweisStatus } from '../../../common/enums/ausbildungsmanagement.enums';

export class CreateAusbildungsnachweisDto {
  @ApiProperty({ example: 'azubi-uuid' })
  @IsString()
  azubiId: string;

  @ApiProperty({ example: 'Ausbildungsnachweis Q1 2026' })
  @IsString()
  @MinLength(2)
  titel: string;

  @ApiProperty({ example: 'Inhalt des Nachweises...' })
  @IsString()
  inhaltMarkdown: string;

  @ApiProperty({ example: 'rahmenlehrplan-uuid' })
  @IsString()
  rahmenlehrplanId: string;

  @ApiProperty({ example: 'betrieblich' })
  @IsString()
  @MinLength(2)
  typ: string;
}

export class AusbildungsnachweisResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'azubi-uuid' })
  @IsString()
  azubiId: string;

  @ApiProperty({ example: 'Ausbildungsnachweis Q1 2026' })
  @IsString()
  titel: string;

  @ApiProperty({ example: 'Inhalt des Nachweises...' })
  @IsString()
  inhaltMarkdown: string;

  @ApiProperty({ example: 'rahmenlehrplan-uuid' })
  @IsString()
  rahmenlehrplanId: string;

  @ApiProperty({ example: 'betrieblich' })
  @IsString()
  typ: string;

  @ApiProperty({ enum: AusbildungsnachweisStatus })
  @IsEnum(AusbildungsnachweisStatus)
  status: AusbildungsnachweisStatus;

  @ApiProperty({ nullable: true })
  @IsString()
  signiertVon: string | null;

  @ApiProperty({ nullable: true, type: Date })
  signiertAm: Date | null;

  @ApiProperty({ nullable: true, type: Date })
  archiviertAm: Date | null;

  @ApiProperty({ type: Date })
  erstelltAm: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export class UpdateAusbildungsnachweisDto extends PartialType(CreateAusbildungsnachweisDto) {}
