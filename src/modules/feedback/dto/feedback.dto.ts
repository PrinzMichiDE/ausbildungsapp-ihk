import { ApiProperty } from '@nestjs/swagger';
import { FeedbackTyp } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ enum: FeedbackTyp, example: FeedbackTyp.azubi_feedback })
  @IsEnum(FeedbackTyp)
  typ: FeedbackTyp;

  @ApiProperty({ required: false, description: 'Bewerteter Auszubildende' })
  @IsOptional()
  @IsUUID('4')
  anUserId?: string;

  @ApiProperty({ required: false, description: 'Bewertete Abteilung' })
  @IsOptional()
  @IsUUID('4')
  abteilungId?: string;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  fachkompetenz?: number;

  @ApiProperty({ required: false, minimum: 1, maximum: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  softskills?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  kommentar?: string;
}

export class FeedbackResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  vonUserId: string;

  @ApiProperty({ nullable: true })
  anUserId: string | null;

  @ApiProperty({ nullable: true })
  abteilungId: string | null;

  @ApiProperty({ enum: FeedbackTyp })
  typ: FeedbackTyp;

  @ApiProperty({ nullable: true })
  fachkompetenz: number | null;

  @ApiProperty({ nullable: true })
  softskills: number | null;

  @ApiProperty({ nullable: true })
  kommentar: string | null;
}
