import { FeedbackTyp } from '@prisma/client';
export declare class CreateFeedbackDto {
    typ: FeedbackTyp;
    anUserId?: string;
    abteilungId?: string;
    fachkompetenz?: number;
    softskills?: number;
    kommentar?: string;
}
export declare class FeedbackResponseDto {
    id: string;
    vonUserId: string;
    anUserId: string | null;
    abteilungId: string | null;
    typ: FeedbackTyp;
    fachkompetenz: number | null;
    softskills: number | null;
    kommentar: string | null;
}
