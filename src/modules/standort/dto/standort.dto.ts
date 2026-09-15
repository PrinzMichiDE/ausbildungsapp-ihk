import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, MinLength, MaxLength } from 'class-validator';

export class CreateStandortDto {
  @ApiProperty({ example: 'Zentrale Ausbildungsstätte' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @ApiProperty({ required: false, example: 'Musterstraße 1' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  adresse?: string;

  @ApiProperty({ required: false, example: '10115' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  plz?: string;

  @ApiProperty({ required: false, example: 'Berlin' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ort?: string;
}

export class StandortResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  adresse: string | null;

  @ApiProperty({ nullable: true })
  plz: string | null;

  @ApiProperty({ nullable: true })
  ort: string | null;
}

export class UpdateStandortDto extends PartialType(CreateStandortDto) {}
