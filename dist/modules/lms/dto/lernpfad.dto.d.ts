import { Prioritaet } from '../../../common/enums/ausbildungsmanagement.enums';
export declare class CreateLernpfadDto {
    courseId: string;
    prioritaet: Prioritaet;
    skipBegruendung?: boolean;
}
export declare class LernpfadResponseDto {
    id: string;
    courseId: string;
    prioritaet: Prioritaet;
    skipBegruendung: boolean | null;
}
