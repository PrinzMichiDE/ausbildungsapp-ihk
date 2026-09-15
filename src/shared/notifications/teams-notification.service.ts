import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration.js';

interface AdaptiveCard {
  type: 'message';
  attachments: Array<{
    contentType: 'application/vnd.microsoft.card.adaptive';
    content: Record<string, unknown>;
  }>;
}

@Injectable()
export class TeamsNotificationService {
  private readonly logger = new Logger(TeamsNotificationService.name);
  private readonly webhookUrl: string;

  constructor(configService: ConfigService) {
    this.webhookUrl = (configService.get<AppConfig['teams']>('teams') as AppConfig['teams'])
      .webhookUrl;
  }

  async send(
    title: string,
    text: string,
    facts: Record<string, string> = {},
  ): Promise<void> {
    if (!this.webhookUrl) {
      this.logger.debug('Kein Teams-Webhook konfiguriert, überspringe Push');
      return;
    }

    const card: AdaptiveCard = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: {
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
              {
                type: 'TextBlock',
                text: title,
                weight: 'Bolder',
                size: 'Medium',
              },
              { type: 'TextBlock', text, wrap: true },
              {
                type: 'FactSet',
                facts: Object.entries(facts).map(([title, value]) => ({
                  title: `${title}:`,
                  value,
                })),
              },
            ],
          },
        },
      ],
    };

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
    } catch (error) {
      this.logger.warn('Teams-Benachrichtigung fehlgeschlagen', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  notifyMissingReport(azubiName: string, kalenderwoche: number): Promise<void> {
    return this.send(
      'Berichtsheft fehlt',
      `Das Berichtsheft für KW ${kalenderwoche} wurde noch nicht eingereicht.`,
      { Auszubildende: azubiName, Kalenderwoche: String(kalenderwoche) },
    );
  }

  notifyPendingReview(reportTitle: string, reviewerName: string): Promise<void> {
    return this.send(
      'Bericht wartet auf Freigabe',
      `Ein Bericht wartet auf deine Prüfung.`,
      { Bericht: reportTitle, Prüfer: reviewerName },
    );
  }

  notifyNewTask(azubiName: string, taskTitle: string): Promise<void> {
    return this.send(
      'Neue Praxisaufgabe',
      `Eine neue Praxisaufgabe wurde freigegeben.`,
      { Auszubildende: azubiName, Aufgabe: taskTitle },
    );
  }
}
