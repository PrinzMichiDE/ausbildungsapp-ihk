import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateEinsatzDto {
  @ApiProperty()
  @IsUUID('4')
  azubiId: string;

  @ApiProperty()
  @IsUUID('4')
  abteilungId: string;

  @ApiProperty({ example: '2026-03-01' })
  @IsDateString()
  von: string;

  @ApiProperty({ example: '2026-08-31' })
  @IsDateString()
  bis: string;

  @ApiProperty({ required: false, example: 1, minimum: 0, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  skillLevel?: number;
}

export class UpdateEinsatzDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  abteilungId?: string;

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
  @IsInt()
  @Min(0)
  @Max(5)
  skillLevel?: number;
}

export class EinsatzResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  abteilungId: string;

  @ApiProperty()
  von: Date;

  @ApiProperty()
  bis: Date;

  @ApiProperty()
  skillLevel: number;
}
