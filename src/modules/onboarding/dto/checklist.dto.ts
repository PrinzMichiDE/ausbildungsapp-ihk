import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateChecklistDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  azubiId?: string;

  @ApiProperty({ example: 'Erster Arbeitstag' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ type: [String], example: ['Hardware ausgeben', 'Account anlegen'] })
  @IsArray()
  @IsString({ each: true })
  items: string[];
}

export class UpdateChecklistItemDto {
  @ApiProperty({ example: true })
  erledigt: boolean;
}

export class ChecklistResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  azubiId: string;

  @ApiProperty()
  titel: string;

  @ApiProperty()
  erledigt: boolean;

  @ApiProperty({ type: [Object] })
  items: Array<{
    id: string;
    text: string;
    erledigt: boolean;
    reihenfolge: number;
  }>;
}
