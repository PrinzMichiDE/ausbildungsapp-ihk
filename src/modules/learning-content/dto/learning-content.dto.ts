import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFrameworkDto {
  @ApiProperty({ example: 'IT-Systeme integrieren und konfigurieren' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ example: 'Netzwerk- und Serverinfrastrukturen bereitstellen' })
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  lernfeld: string;

  @ApiProperty({ example: 'Netzwerkinfrastrukturen planen' })
  @IsString()
  @MinLength(3)
  kompetenz: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiProperty({ required: false, example: 'IHK-Rahmenplan FIS' })
  @IsOptional()
  @IsString()
  quelle?: string;
}

export class UpdateFrameworkDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lernfeld?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  kompetenz?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;
}

export class CreateCourseDto {
  @ApiProperty()
  @IsUUID('4')
  frameworkId: string;

  @ApiProperty({ example: 'Grundlagen TCP/IP & Subnetting' })
  @IsString()
  @MinLength(3)
  titel: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lernziele?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  theorie?: string;
}

export class CreateTaskDto {
  @ApiProperty()
  @IsUUID('4')
  frameworkId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  courseId?: string;

  @ApiProperty({ example: 'IP-Adresskonzept für ein internes Testnetz erstellen' })
  @IsString()
  @MinLength(3)
  titel: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  musterloesung?: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}

export class UploadAiDocumentDto {
  @ApiProperty({ example: 'ihk-rahmenplan-fis.pdf' })
  @IsString()
  @MinLength(3)
  filename: string;

  @ApiProperty({ required: false, example: 'IHK' })
  @IsOptional()
  @IsString()
  quelle?: string;

  @ApiProperty({ description: 'Volltext des importierten Dokuments' })
  @IsString()
  @MinLength(10)
  inhalt: string;
}

export class GenerateFromDocDto {
  @ApiProperty({ description: 'ID des vektorisierten IHK-Dokuments' })
  @IsUUID('4')
  documentId: string;
}

export class FrameworkResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  titel: string;

  @ApiProperty()
  lernfeld: string;

  @ApiProperty()
  kompetenz: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  quelle: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class CourseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty()
  titel: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ isArray: true })
  lernziele: string[];

  @ApiProperty({ nullable: true })
  theorie: string | null;

  @ApiProperty()
  freigegeben: boolean;

  @ApiProperty({ description: 'KI-generiert gemäß EU AI Act §6.3' })
  kiGeneriert: boolean;

  @ApiProperty({ nullable: true, description: 'Qualitäts-Score (0-100)' })
  qualitaetsScore: number | null;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  frameworkId: string;

  @ApiProperty({ nullable: true })
  courseId: string | null;

  @ApiProperty()
  titel: string;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;

  @ApiProperty({ nullable: true })
  musterloesung: string | null;

  @ApiProperty()
  freigegeben: boolean;

  @ApiProperty({ description: 'KI-generiert gemäß EU AI Act §6.3' })
  kiGeneriert: boolean;
}
