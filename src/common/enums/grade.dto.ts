import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsEnum, MaxLength, Min, Max } from 'class-validator';
import { GradeStatus, GradeTyp, Halbjahr, Gewichtungskategorie, Pruefungsart } from '@prisma/client';

export class GradeStatusDto {
  @ApiProperty({ enum: GradeStatus })
  @IsEnum(GradeStatus)
  status: GradeStatus;
}

export class GradeTypDto {
  @ApiProperty({ enum: GradeTyp })
  @IsEnum(GradeTyp)
  typ: GradeTyp;
}

export class HalbjahrDto {
  @ApiProperty({ enum: Halbjahr })
  @IsEnum(Halbjahr)
  halbjahr: Halbjahr;
}

export class GewichtungskategorieDto {
  @ApiProperty({ enum: Gewichtungskategorie })
  @IsEnum(Gewichtungskategorie)
  gewichtungsKategorie: Gewichtungskategorie;
}

export class PruefungsartDto {
  @ApiProperty({ enum: Pruefungsart })
  @IsEnum(Pruefungsart)
  pruefungsart: Pruefungsart;
}

export class UpdateGradeEntryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  fach?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  halbjahr?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 6 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(6)
  note?: number;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  datum?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pruefungsart?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  gewichtung?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zeugnisUrl?: string;
}

export class UpdateGradeEntryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  fach: string;

  @ApiProperty()
  halbjahr: string | null;

  @ApiProperty()
  note: number;

  @ApiProperty({ nullable: true, type: Date })
  datum: Date | null;

  @ApiProperty({ nullable: true })
  pruefungsart: string | null;

  @ApiProperty()
  gewichtung: number;

  @ApiProperty({ nullable: true })
  zeugnisUrl: string | null;

  @ApiProperty()
  createdAt: Date;
}
