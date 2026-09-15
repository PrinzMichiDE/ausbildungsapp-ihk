import { ApiProperty } from '@nestjs/swagger';

export class AuditResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  action: string;

  @ApiProperty({ nullable: true })
  entity: string | null;

  @ApiProperty({ nullable: true })
  entityId: string | null;

  @ApiProperty({ nullable: true })
  details: string | null;

  @ApiProperty({ nullable: true })
  ipAddress: string | null;

  @ApiProperty({ nullable: true })
  userAgent: string | null;

  @ApiProperty()
  createdAt: Date;
}