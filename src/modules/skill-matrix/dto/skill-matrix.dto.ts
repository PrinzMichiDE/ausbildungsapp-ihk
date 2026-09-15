import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export enum SkillStatusDto {
  nicht_begonnen = 'nicht_begonnen',
  in_arbeit = 'in_arbeit',
  vermittelt = 'vermittelt',
}

export enum LernpfadPrioritaetDto {
  hoch = 'hoch',
  mittel = 'mittel',
  niedrig = 'niedrig',
}

export class CreateSkillAssignmentDto {
  @ApiProperty({ description: 'ID des Azubis' })
  @IsUUID('4')
  azubiId: string;

  @ApiProperty({ description: 'ID des IHK-Lernfelds (Framework)' })
  @IsUUID('4')
  frameworkId: string;

  @ApiProperty({ required: false, description: 'ID des Kurses (optional)' })
  @IsOptional()
  @IsUUID('4')
  courseId?: string;

  @ApiProperty({ required: false, enum: SkillStatusDto, default: SkillStatusDto.nicht_begonnen })
  @IsOptional()
  @IsEnum(SkillStatusDto)
  status?: SkillStatusDto;

  @ApiProperty({ required: false, description: 'Bemerkungen zur Zuordnung' })
  @IsOptional()
  @IsString()
  bemerkungen?: string;
}

export class UpdateSkillAssignmentDto extends PartialType(CreateSkillAssignmentDto) {
  @ApiProperty({ required: false, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  fortschritt?: number;
}

export class MarkVermitteltDto {
  @ApiProperty({ required: false, description: 'Optionale Bemerkungen zur Vermittlung' })
  @IsOptional()
  @IsString()
  bemerkungen?: string;
}

export class SkillAssignmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty({ nullable: true })
  courseId: string | null;

  @ApiProperty({ enum: SkillStatusDto })
  status: SkillStatusDto;

  @ApiProperty({ minimum: 0, maximum: 100 })
  fortschritt: number;

  @ApiProperty({ nullable: true })
  vermitteltVon: string | null;

  @ApiProperty({ nullable: true })
  vermitteltAm: Date | null;

  @ApiProperty({ nullable: true })
  bemerkungen: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SkillGapResponseDto {
  @ApiProperty()
  frameworkId: string;

  @ApiProperty()
  frameworkTitel: string;

  @ApiProperty()
  lernfeld: string;

  @ApiProperty()
  kompetenz: string;

  @ApiProperty()
  status: SkillStatusDto;

  @ApiProperty({ minimum: 0, maximum: 100 })
  fortschritt: number;

  @ApiProperty()
  erforderlich: boolean;

  @ApiProperty()
  kurseTotal: number;

  @ApiProperty()
  kurseVermittelt: number;

  @ApiProperty({ type: [String] })
  fehlendeKurse: string[];
}

export class SkillGapQueryDto {
  @ApiProperty({ required: false, description: 'Filter nach Azubi-ID' })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiProperty({ required: false, description: 'Filter nach Framework/Lernfeld-ID' })
  @IsOptional()
  @IsUUID('4')
  frameworkId?: string;

  @ApiProperty({ required: false, description: 'Filter nach Ausbildungsberuf' })
  @IsOptional()
  @IsString()
  beruf?: string;
}

export class BenchmarkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  jahrgang: number;

  @ApiProperty()
  beruf: string;

  @ApiProperty()
  lernfeldId: string;

  @ApiProperty()
  durchschnittNote: number;

  @ApiProperty()
  durchschnittAbdeckungProzent: number;

  @ApiProperty()
  durchschnittFortschritt: number;

  @ApiProperty()
  azubiAnzahl: number;

  @ApiProperty()
  berechnetAm: Date;
}

export class CreateLernpfadDto {
  @ApiProperty({ description: 'ID des Azubis' })
  @IsUUID('4')
  azubiId: string;

  @ApiProperty({ description: 'ID des Kurses' })
  @IsUUID('4')
  courseId: string;

  @ApiProperty({ enum: LernpfadPrioritaetDto, default: LernpfadPrioritaetDto.mittel })
  @IsEnum(LernpfadPrioritaetDto)
  prioritaet: LernpfadPrioritaetDto;

  @ApiProperty({ required: false, description: 'Begründung für Skip' })
  @IsOptional()
  @IsString()
  skipBegründung?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  ausgeschlossen?: boolean;
}

export class UpdateLernpfadDto extends PartialType(CreateLernpfadDto) {}

export class LernpfadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty({ enum: LernpfadPrioritaetDto })
  prioritaet: LernpfadPrioritaetDto;

  @ApiProperty({ nullable: true })
  skipBegründung: string | null;

  @ApiProperty()
  ausgeschlossen: boolean;

  @ApiProperty()
  erstelltVon: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
