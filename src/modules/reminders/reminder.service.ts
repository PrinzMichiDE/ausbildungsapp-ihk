import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NotificationCategory, NotificationPriority, Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { TeamsNotificationService } from '../../shared/notifications/teams-notification.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly teams: TeamsNotificationService,
    private readonly notifications: NotificationsService,
  ) {}

  @Cron('0 0 16 * * 5', { name: 'friday-report-reminder' })
  async sendFridayReminders(): Promise<void> {
    const now = new Date();
    const year = now.getFullYear();
    const kw = this.getIsoWeek(now);

    const azubis = await this.prisma.user.findMany({
      where: { roles: { some: { role: 'azubi' } } },
    });

    for (const azubi of azubis) {
      const submitted = await this.prisma.report.count({
        where: {
          azubiId: azubi.id,
          jahr: year,
          kalenderwoche: kw,
          status: { in: ['eingereicht', 'in_pruefung', 'visiert', 'archiviert'] },
        },
      });
      if (submitted === 0) {
        await this.notifications.create({
          userId: azubi.id,
          category: NotificationCategory.reminder,
          title: 'Berichtsheft fehlt',
          message: `Das Berichtsheft für KW ${kw} wurde noch nicht eingereicht.`,
          priority: NotificationPriority.medium,
        });
        await this.teams.notifyMissingReport(
          `${azubi.firstName} ${azubi.lastName}`,
          kw,
        );
      }
    }
    this.logger.log(`Freitags-Erinnerung für KW ${kw} versendet`);
  }

  @Cron('0 0 17 * * 5', { name: 'friday-review-reminder' })
  async sendReviewReminders(): Promise<void> {
    const pendingReports = await this.prisma.report.findMany({
      where: { status: 'eingereicht' },
      include: {
        azubi: { select: { firstName: true, lastName: true } },
      },
    });

    if (pendingReports.length === 0) {
      return;
    }

    const reviewers = await this.prisma.user.findMany({
      where: {
        roles: {
          some: { role: { in: [Role.ausbilder, Role.ausbildungsbeauftragter] } },
        },
      },
      select: { id: true, firstName: true, lastName: true },
    });

    for (const reviewer of reviewers) {
      await this.notifications.create({
        userId: reviewer.id,
        category: NotificationCategory.reminder,
        title: 'Offene Berichte zur Prüfung',
        message: `${pendingReports.length} Bericht(e) warten auf Ihre Prüfung.`,
        priority: NotificationPriority.medium,
      });
    }

    this.logger.log(
      `Review-Erinnerung: ${pendingReports.length} offene Berichte, ${reviewers.length} Reviewer benachrichtigt`,
    );
  }

  private getIsoWeek(date: Date): number {
    const target = new Date(date.getTime());
    const dayNr = (target.getUTCDay() + 6) % 7;
    target.setUTCDate(target.getUTCDate() - dayNr + 3);
    const firstThursday = target.getTime();
    target.setUTCMonth(0, 1);
    if (target.getUTCDay() !== 4) {
      target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
    }
    return 1 + Math.ceil((firstThursday - target.getTime()) / (7 * 86400000));
  }
}
