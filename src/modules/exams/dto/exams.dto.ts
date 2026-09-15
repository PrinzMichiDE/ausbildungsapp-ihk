import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IsDateString } from 'class-validator';

export class CreatePruefungDto {
  @ApiProperty({ example: 'AP2 - Abschlussprüfung Teil 2' })
  @IsString()
  @IsOptional()
  beschreibung?: string;

  @ApiProperty({ example: '2026-06-15', description: 'IHK-Termin' })
  @IsDateString()
  @IsOptional()
  ihkTermin?: string;
}

export class UpdatePruefungDto extends PartialType(CreatePruefungDto) {}

export class PruefungResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  typ: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  ihkTermin: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class CreateMeilensteinDto {
  @ApiProperty({ example: 'Antrag einreichen' })
  @IsString()
  titel: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiProperty({ required: false, example: '2026-05-01' })
  @IsDateString()
  @IsOptional()
  faelligAm?: string;
}

export class UpdateMeilensteinDto extends PartialType(CreateMeilensteinDto) {}

export class PruefungsMeilensteinResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pruefungId: string;

  @ApiProperty()
  titel: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  faelligAm: Date | null;

  @ApiProperty()
  erledigt: boolean;

  @ApiProperty({ nullable: true })
  erledigtAm: Date | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}