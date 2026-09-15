export declare enum SkillStatusDto {
    nicht_begonnen = "nicht_begonnen",
    in_arbeit = "in_arbeit",
    vermittelt = "vermittelt"
}
export declare enum LernpfadPrioritaetDto {
    hoch = "hoch",
    mittel = "mittel",
    niedrig = "niedrig"
}
export declare class CreateSkillAssignmentDto {
    azubiId: string;
    frameworkId: string;
    courseId?: string;
    status?: SkillStatusDto;
    bemerkungen?: string;
}
declare const UpdateSkillAssignmentDto_base: import("@nestjs/common").Type<Partial<CreateSkillAssignmentDto>>;
export declare class UpdateSkillAssignmentDto extends UpdateSkillAssignmentDto_base {
    fortschritt?: number;
}
export declare class MarkVermitteltDto {
    bemerkungen?: string;
}
export declare class SkillAssignmentResponseDto {
    id: string;
    azubiId: string;
    frameworkId: string;
    courseId: string | null;
    status: SkillStatusDto;
    fortschritt: number;
    vermitteltVon: string | null;
    vermitteltAm: Date | null;
    bemerkungen: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare class SkillGapResponseDto {
    frameworkId: string;
    frameworkTitel: string;
    lernfeld: string;
    kompetenz: string;
    status: SkillStatusDto;
    fortschritt: number;
    erforderlich: boolean;
    kurseTotal: number;
    kurseVermittelt: number;
    fehlendeKurse: string[];
}
export declare class SkillGapQueryDto {
    azubiId?: string;
    frameworkId?: string;
    beruf?: string;
}
export declare class BenchmarkResponseDto {
    id: string;
    jahrgang: number;
    beruf: string;
    lernfeldId: string;
    durchschnittNote: number;
    durchschnittAbdeckungProzent: number;
    durchschnittFortschritt: number;
    azubiAnzahl: number;
    berechnetAm: Date;
}
export declare class CreateLernpfadDto {
    azubiId: string;
    courseId: string;
    prioritaet: LernpfadPrioritaetDto;
    skipBegründung?: string;
    ausgeschlossen?: boolean;
}
declare const UpdateLernpfadDto_base: import("@nestjs/common").Type<Partial<CreateLernpfadDto>>;
export declare class UpdateLernpfadDto extends UpdateLernpfadDto_base {
}
export declare class LernpfadResponseDto {
    id: string;
    azubiId: string;
    courseId: string;
    prioritaet: LernpfadPrioritaetDto;
    skipBegründung: string | null;
    ausgeschlossen: boolean;
    erstelltVon: string;
    createdAt: Date;
    updatedAt: Date;
}
export {};
