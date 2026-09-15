import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, Max } from 'class-validator';

export class CreateGradeEntryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiProperty({ example: 'Mathematik' })
  @IsString()
  @MaxLength(100)
  fach: string;

  @ApiProperty({ required: false, enum: ['erstes', 'zweites'] })
  @IsOptional()
  @IsString()
  halbjahr?: string;

  @ApiProperty({ example: 2.3, minimum: 1, maximum: 6 })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(6)
  note: number;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  datum?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pruefungsart?: string;

  @ApiProperty({ required: false, example: 1.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  gewichtung?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zeugnisUrl?: string;
}

export class GradeEntryResponseDto {
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
