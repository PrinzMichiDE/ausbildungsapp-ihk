import { ConfigService } from '@nestjs/config';
export declare class TeamsNotificationService {
    private readonly logger;
    private readonly webhookUrl;
    constructor(configService: ConfigService);
    send(title: string, text: string, facts?: Record<string, string>): Promise<void>;
    notifyMissingReport(azubiName: string, kalenderwoche: number): Promise<void>;
    notifyPendingReview(reportTitle: string, reviewerName: string): Promise<void>;
    notifyNewTask(azubiName: string, taskTitle: string): Promise<void>;
}
