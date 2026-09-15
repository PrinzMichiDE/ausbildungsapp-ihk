import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Ausbildungsberuf, AusbildungsplanStatus } from '@prisma/client';

export class CreateAusbildungsplanDto {
  @ApiProperty({ example: 'systemintegration' })
  beruf: Ausbildungsberuf;

  @ApiProperty({ example: 2026 })
  @IsNumber()
  jahr: number;

  @ApiProperty({ required: false })
  @IsOptional()
  inhalte?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  anhangUrl?: string;
}

export class AusbildungsplanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  ausbilderId: string;

  @ApiProperty({ example: 'systemintegration' })
  beruf: Ausbildungsberuf;

  @ApiProperty()
  jahr: number;

  @ApiProperty({ required: false })
  inhalte?: Record<string, any>;

  @ApiProperty({ example: 'entwurf' })
  status: AusbildungsplanStatus;

  @ApiProperty({ required: false })
  anhangUrl?: string;

  @ApiProperty({ required: false })
  gueltigVon?: Date;

  @ApiProperty({ required: false })
  gueltigBis?: Date;

  @ApiProperty({ required: false })
  geprueftVon?: string;

  @ApiProperty({ required: false })
  geprueftAm?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UpdateAusbildungsplanDto extends PartialType(CreateAusbildungsplanDto) {}
