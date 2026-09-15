import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAbteilungDto {
  @ApiProperty({ example: 'Systemintegration' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ required: false, example: 'SI' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  kurzzeichen?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;
}

export class UpdateAbteilungDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  kurzzeichen?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  beschreibung?: string;
}

export class AbteilungResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  kurzzeichen: string | null;

  @ApiProperty({ nullable: true })
  beschreibung: string | null;
}
