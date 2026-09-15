import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsObject } from 'class-validator';

export class CreateVersionDto {
  @ApiProperty({ example: 'major' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'report-uuid' })
  @IsString()
  reference: string;

  @ApiProperty({ example: {} })
  @IsObject()
  metadata: Record<string, unknown>;
}

export class VersionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  reference: string;

  @ApiProperty()
  metadata: Record<string, unknown>;
}
