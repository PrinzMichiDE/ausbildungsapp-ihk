import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWikiPageDto {
  @ApiProperty({ example: 'Erste Schritte im Berichtsheft' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  titel: string;

  @ApiProperty({ example: 'erste-schritte-berichtsheft' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  slug: string;

  @ApiProperty({ required: false, example: 'How-To' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  kategorie?: string;

  @ApiProperty({ description: 'Markdown' })
  @IsString()
  @MinLength(1)
  inhaltMarkdown: string;
}

export class UpdateWikiPageDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  titel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  kategorie?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inhaltMarkdown?: string;
}

export class WikiPageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  titel: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ nullable: true })
  kategorie: string | null;

  @ApiProperty()
  inhaltMarkdown: string;
}
