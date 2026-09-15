import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID, IsEnum } from 'class-validator';
import { Prioritaet } from '../../../common/enums/ausbildungsmanagement.enums';

export class CreateLernpfadDto {
  @ApiProperty({ example: 'course-uuid' })
  @IsUUID('4')
  courseId: string;

  @ApiProperty({ enum: Prioritaet })
  @IsEnum(Prioritaet)
  prioritaet: Prioritaet;

  @ApiProperty({ required: false, example: true })
  skipBegruendung?: boolean;
}

export class LernpfadResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseId: string;

  @ApiProperty({ enum: Prioritaet })
  prioritaet: Prioritaet;

  @ApiProperty({ nullable: true })
  skipBegruendung: boolean | null;
}
