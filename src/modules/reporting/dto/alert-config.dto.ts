import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

export enum AlertTyp {
  noten = 'noten',
  berichtsheft = 'berichtsheft',
  kurs = 'kurs',
  pruefung = 'pruefung',
  foerderbedarf = 'foerderbedarf',
  kapazitaet = 'kapazitaet',
}

export class CreateAlertConfigDto {
  @ApiProperty({ enum: AlertTyp, example: AlertTyp.noten })
  @IsEnum(AlertTyp)
  typ: AlertTyp;

  @ApiProperty({
    example: { noteGleich4InZweiFächern: true, fehlendeBerichteSchwelle: 3, noteUnter3InEinem: true },
    description: 'Schwelle als JSON',
  })
  @IsObject()
  schwelle: Record<string, unknown>;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  aktiv?: boolean;
}

export class UpdateAlertConfigDto {
  @ApiPropertyOptional({ enum: AlertTyp })
  @IsOptional()
  @IsEnum(AlertTyp)
  typ?: AlertTyp;

  @ApiPropertyOptional({ description: 'Schwelle JSON' })
  @IsOptional()
  @IsObject()
  schwelle?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  aktiv?: boolean;
}

export class AlertConfigResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  userId: string | null;

  @ApiProperty({ enum: AlertTyp })
  typ: string;

  @ApiProperty({ type: Object })
  schwelle: Record<string, unknown>;

  @ApiProperty()
  aktiv: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
