import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID, MinLength, Min, Max } from 'class-validator';

export class CreateEinsatzPlanungDto {
  @ApiProperty({ example: 'Systemintegration' })
  @IsString()
  @MinLength(2)
  beruf: string;

  @ApiProperty({ example: 'abteilung-uuid' })
  @IsUUID('4')
  abteilungId: string;

  @ApiProperty({ example: '2026-01-01' })
  von: Date;

  @ApiProperty({ example: '2026-06-30' })
  bis: Date;

  @ApiProperty({ required: false, example: 3, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  skillLevel?: number;
}

export class EinsatzPlanungResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  beruf: string;

  @ApiProperty()
  abteilungId: string;

  @ApiProperty({ type: Date })
  von: Date;

  @ApiProperty({ type: Date })
  bis: Date;

  @ApiProperty({ nullable: true })
  skillLevel: number | null;
}
