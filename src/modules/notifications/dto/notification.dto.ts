import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationCategory, NotificationPriority } from '@prisma/client';

export class NotificationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: NotificationCategory })
  category: NotificationCategory;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ enum: NotificationPriority })
  priority: NotificationPriority;

  @ApiProperty({ nullable: true })
  readAt: Date | null;

  @ApiProperty({ nullable: true })
  acknowledgedAt: Date | null;

  @ApiProperty({ nullable: true })
  referenceType: string | null;

  @ApiProperty({ nullable: true })
  referenceId: string | null;

  @ApiProperty()
  createdAt: Date;
}

export class NotificationPreferenceItemDto {
  @ApiProperty({ enum: NotificationCategory })
  @IsEnum(NotificationCategory)
  category: NotificationCategory;

  @ApiProperty({ default: true })
  @IsBoolean()
  inApp: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  email: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  teams: boolean;
}

export class UpdateNotificationPreferencesDto {
  @ApiProperty({ type: [NotificationPreferenceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationPreferenceItemDto)
  preferences: NotificationPreferenceItemDto[];
}

export class NotificationPreferenceResponseDto {
  @ApiProperty({ enum: NotificationCategory })
  category: NotificationCategory;

  @ApiProperty()
  inApp: boolean;

  @ApiProperty()
  email: boolean;

  @ApiProperty()
  teams: boolean;
}

export class UnreadCountDto {
  @ApiProperty()
  count: number;
}

export class AcknowledgeResponseDto {
  @ApiProperty()
  ok: boolean;
}

export interface CreateNotificationInput {
  userId: string;
  category: NotificationCategory;
  title: string;
  message: string;
  priority?: NotificationPriority;
  referenceType?: string;
  referenceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export const DEFAULT_PREFERENCES: ReadonlyArray<NotificationPreferenceResponseDto> =
  [
    {
      category: NotificationCategory.review,
      inApp: true,
      email: false,
      teams: false,
    },
    {
      category: NotificationCategory.deadline,
      inApp: true,
      email: true,
      teams: false,
    },
    {
      category: NotificationCategory.reminder,
      inApp: true,
      email: true,
      teams: false,
    },
    {
      category: NotificationCategory.absence,
      inApp: true,
      email: false,
      teams: false,
    },
    {
      category: NotificationCategory.system,
      inApp: true,
      email: false,
      teams: false,
    },
  ];

export function defaultPreferences(): NotificationPreferenceResponseDto[] {
  return DEFAULT_PREFERENCES.map((p) => ({ ...p }));
}

export function isKnownCategory(
  category: NotificationCategory,
): boolean {
  return Object.values(NotificationCategory).includes(category);
}

export function describeCategory(category: NotificationCategory): string {
  const labels: Record<NotificationCategory, string> = {
    [NotificationCategory.review]: 'Freigaben',
    [NotificationCategory.deadline]: 'Fristen',
    [NotificationCategory.reminder]: 'Erinnerungen',
    [NotificationCategory.absence]: 'Abwesenheiten',
    [NotificationCategory.system]: 'System',
  };
  return labels[category];
}