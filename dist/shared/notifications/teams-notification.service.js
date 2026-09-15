var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TeamsNotificationService_1;
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
let TeamsNotificationService = TeamsNotificationService_1 = class TeamsNotificationService {
    logger = new Logger(TeamsNotificationService_1.name);
    webhookUrl;
    constructor(configService) {
        this.webhookUrl = configService.get('teams')
            .webhookUrl;
    }
    async send(title, text, facts = {}) {
        if (!this.webhookUrl) {
            this.logger.debug('Kein Teams-Webhook konfiguriert, überspringe Push');
            return;
        }
        const card = {
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
        }
        catch (error) {
            this.logger.warn('Teams-Benachrichtigung fehlgeschlagen', {
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    notifyMissingReport(azubiName, kalenderwoche) {
        return this.send('Berichtsheft fehlt', `Das Berichtsheft für KW ${kalenderwoche} wurde noch nicht eingereicht.`, { Auszubildende: azubiName, Kalenderwoche: String(kalenderwoche) });
    }
    notifyPendingReview(reportTitle, reviewerName) {
        return this.send('Bericht wartet auf Freigabe', `Ein Bericht wartet auf deine Prüfung.`, { Bericht: reportTitle, Prüfer: reviewerName });
    }
    notifyNewTask(azubiName, taskTitle) {
        return this.send('Neue Praxisaufgabe', `Eine neue Praxisaufgabe wurde freigegeben.`, { Auszubildende: azubiName, Aufgabe: taskTitle });
    }
};
TeamsNotificationService = TeamsNotificationService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], TeamsNotificationService);
export { TeamsNotificationService };
//# sourceMappingURL=teams-notification.service.js.map