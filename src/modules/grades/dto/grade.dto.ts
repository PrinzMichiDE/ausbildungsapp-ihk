import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart } from '@prisma/client';

export class CreateGradeDto {
  @ApiProperty({ required: false, description: 'Azubi-ID (optional, defaults to current user)' })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiProperty({ example: 'Mathematik' })
  @IsString()
  @MaxLength(100)
  fach: string;

  @ApiProperty({ example: 2.3, minimum: 1, maximum: 6 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(6)
  note: number;

  @ApiProperty({ example: '2026/2027 (1. Halbjahr)' })
  @IsString()
  @MaxLength(100)
  zeitraum: string;

  @ApiProperty({ required: false, enum: Halbjahr })
  @IsOptional()
  halbjahr?: Halbjahr;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  datum?: Date;

  @ApiProperty({ required: false, enum: Pruefungsart })
  @IsOptional()
  pruefungsart?: Pruefungsart;

  @ApiProperty({ required: false, example: 1.0, minimum: 0.1 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  gewichtung?: number;

  @ApiProperty({ required: false, enum: Gewichtungskategorie })
  @IsOptional()
  gewichtungsKategorie?: Gewichtungskategorie;

  @ApiProperty({ required: false, enum: GradeTyp, default: GradeTyp.note })
  @IsOptional()
  typ?: GradeTyp;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  beschreibung?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bemerkungen?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  prueferId?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  pruefungsdatum?: Date;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  wiederholung?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maßnahme?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zeugnisUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  quellenUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  kursId?: string;
}

export class UpdateGradeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fach?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 6 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(6)
  note?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  zeitraum?: string;

  @ApiProperty({ required: false, enum: Halbjahr })
  @IsOptional()
  halbjahr?: Halbjahr;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  datum?: Date;

  @ApiProperty({ required: false, enum: Pruefungsart })
  @IsOptional()
  pruefungsart?: Pruefungsart;

  @ApiProperty({ required: false, minimum: 0.1 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  gewichtung?: number;

  @ApiProperty({ required: false, enum: Gewichtungskategorie })
  @IsOptional()
  gewichtungsKategorie?: Gewichtungskategorie;

  @ApiProperty({ required: false, enum: GradeTyp })
  @IsOptional()
  typ?: GradeTyp;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bemerkungen?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  prueferId?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  pruefungsdatum?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  wiederholung?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maßnahme?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zeugnisUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  quellenUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  kursId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  status?: GradeStatus;
}

export class GradeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  fach: string;

  @ApiProperty()
  note: number;

  @ApiProperty()
  zeitraum: string;

  @ApiProperty({ nullable: true, enum: Halbjahr })
  halbjahr: Halbjahr | null;

  @ApiProperty({ nullable: true, type: Date })
  datum: Date | null;

  @ApiProperty({ nullable: true, enum: Pruefungsart })
  pruefungsart: Pruefungsart | null;

  @ApiProperty()
  gewichtung: number;

  @ApiProperty({ nullable: true, enum: Gewichtungskategorie })
  gewichtungsKategorie: Gewichtungskategorie | null;

  @ApiProperty({ enum: GradeTyp })
  typ: GradeTyp;

  @ApiProperty({ enum: GradeStatus })
  status: GradeStatus;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  bemerkungen: string | null;

  @ApiProperty({ nullable: true })
  prueferId: string | null;

  @ApiProperty({ nullable: true, type: Date })
  pruefungsdatum: Date | null;

  @ApiProperty()
  wiederholung: boolean;

  @ApiProperty({ nullable: true })
  maßnahme: string | null;

  @ApiProperty({ nullable: true })
  zeugnisUrl: string | null;

  @ApiProperty({ nullable: true })
  quellenUrl: string | null;

  @ApiProperty({ nullable: true })
  kursId: string | null;

  @ApiProperty({ nullable: true })
  bewertetVon: string | null;

  @ApiProperty({ nullable: true, type: Date })
  bewertetAm: Date | null;

  @ApiProperty({ nullable: true })
  bewertung: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GradeVersionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  gradeId: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  fach: string;

  @ApiProperty()
  note: number;

  @ApiProperty({ enum: GradeStatus })
  status: GradeStatus;

  @ApiProperty()
  zeitraum: string;

  @ApiProperty({ nullable: true, enum: Halbjahr })
  halbjahr: Halbjahr | null;

  @ApiProperty({ nullable: true, type: Date })
  datum: Date | null;

  @ApiProperty({ nullable: true, enum: Pruefungsart })
  pruefungsart: Pruefungsart | null;

  @ApiProperty()
  gewichtung: number;

  @ApiProperty({ nullable: true, enum: Gewichtungskategorie })
  gewichtungsKategorie: Gewichtungskategorie | null;

  @ApiProperty({ enum: GradeTyp })
  typ: GradeTyp;

  @ApiProperty({ nullable: true })
  bemerkungen: string | null;

  @ApiProperty({ nullable: true })
  prueferId: string | null;

  @ApiProperty({ nullable: true, type: Date })
  pruefungsdatum: Date | null;

  @ApiProperty()
  wiederholung: boolean;

  @ApiProperty({ nullable: true })
  maßnahme: string | null;

  @ApiProperty({ nullable: true })
  zeugnisUrl: string | null;

  @ApiProperty({ nullable: true })
  bewertetVon: string | null;

  @ApiProperty({ nullable: true, type: Date })
  bewertetAm: Date | null;

  @ApiProperty()
  erstelltVon: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class GradeStatusDto {
  @ApiProperty({ enum: GradeStatus })
  status: GradeStatus;
}

export class GradeTypDto {
  @ApiProperty({ enum: GradeTyp })
  typ: GradeTyp;
}

export class HalbjahrDto {
  @ApiProperty({ enum: Halbjahr })
  halbjahr: Halbjahr;
}

export class GewichtungskategorieDto {
  @ApiProperty({ enum: Gewichtungskategorie })
  gewichtungsKategorie: Gewichtungskategorie;
}

export class PruefungsartDto {
  @ApiProperty({ enum: Pruefungsart })
  pruefungsart: Pruefungsart;
}
