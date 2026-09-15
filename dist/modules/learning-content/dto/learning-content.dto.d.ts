export declare class CreateFrameworkDto {
    titel: string;
    lernfeld: string;
    kompetenz: string;
    beschreibung?: string;
    quelle?: string;
}
export declare class UpdateFrameworkDto {
    titel?: string;
    lernfeld?: string;
    kompetenz?: string;
    beschreibung?: string;
}
export declare class CreateCourseDto {
    frameworkId: string;
    titel: string;
    beschreibung?: string;
    lernziele?: string[];
    theorie?: string;
}
export declare class CreateTaskDto {
    frameworkId: string;
    courseId?: string;
    titel: string;
    beschreibung?: string;
    musterloesung?: string;
}
declare const UpdateCourseDto_base: import("@nestjs/common").Type<Partial<CreateCourseDto>>;
export declare class UpdateCourseDto extends UpdateCourseDto_base {
}
declare const UpdateTaskDto_base: import("@nestjs/common").Type<Partial<CreateTaskDto>>;
export declare class UpdateTaskDto extends UpdateTaskDto_base {
}
export declare class UploadAiDocumentDto {
    filename: string;
    quelle?: string;
    inhalt: string;
}
export declare class GenerateFromDocDto {
    documentId: string;
}
export declare class FrameworkResponseDto {
    id: string;
    titel: string;
    lernfeld: string;
    kompetenz: string;
    beschreibung: string | null;
    quelle: string | null;
    createdAt: Date;
}
export declare class CourseResponseDto {
    id: string;
    frameworkId: string;
    titel: string;
    beschreibung: string | null;
    lernziele: string[];
    theorie: string | null;
    freigegeben: boolean;
    kiGeneriert: boolean;
    qualitaetsScore: number | null;
}
export declare class TaskResponseDto {
    id: string;
    frameworkId: string;
    courseId: string | null;
    titel: string;
    beschreibung: string | null;
    musterloesung: string | null;
    freigegeben: boolean;
    kiGeneriert: boolean;
}
export {};
