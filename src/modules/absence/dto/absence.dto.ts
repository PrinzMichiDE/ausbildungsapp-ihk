import { ApiProperty } from '@nestjs/swagger';
import { AbwesenheitTyp, AbwesenheitQuelle } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateAbwesenheitDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiProperty({ required: true, enum: AbwesenheitTyp, example: AbwesenheitTyp.urlaub })
  @IsEnum(AbwesenheitTyp)
  typ: AbwesenheitTyp;

  @ApiProperty({ required: false, enum: AbwesenheitQuelle })
  @IsOptional()
  @IsEnum(AbwesenheitQuelle)
  quelle?: AbwesenheitQuelle;

  @ApiProperty({ required: true, example: '2026-07-01' })
  @IsDateString()
  von: string;

  @ApiProperty({ required: true, example: '2026-07-14' })
  @IsDateString()
  bis: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notiz?: string;
}

export class UpdateAbwesenheitDto {
  @ApiProperty({ required: false, enum: AbwesenheitTyp })
  @IsOptional()
  @IsEnum(AbwesenheitTyp)
  typ?: AbwesenheitTyp;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  von?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  bis?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notiz?: string;
}

export class AbwesenheitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty({ enum: AbwesenheitTyp })
  typ: AbwesenheitTyp;

  @ApiProperty({ enum: AbwesenheitQuelle })
  quelle: AbwesenheitQuelle;

  @ApiProperty()
  von: Date;

  @ApiProperty()
  bis: Date;

  @ApiProperty({ nullable: true })
  notiz: string | null;
}
