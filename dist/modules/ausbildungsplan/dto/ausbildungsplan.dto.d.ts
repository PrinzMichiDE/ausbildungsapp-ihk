import { Ausbildungsberuf, AusbildungsplanStatus } from '@prisma/client';
export declare class CreateAusbildungsplanDto {
    beruf: Ausbildungsberuf;
    jahr: number;
    inhalte?: Record<string, any>;
    anhangUrl?: string;
}
export declare class AusbildungsplanResponseDto {
    id: string;
    azubiId: string;
    ausbilderId: string;
    beruf: Ausbildungsberuf;
    jahr: number;
    inhalte?: Record<string, any>;
    status: AusbildungsplanStatus;
    anhangUrl?: string;
    gueltigVon?: Date;
    gueltigBis?: Date;
    geprueftVon?: string;
    geprueftAm?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const UpdateAusbildungsplanDto_base: import("@nestjs/common").Type<Partial<CreateAusbildungsplanDto>>;
export declare class UpdateAusbildungsplanDto extends UpdateAusbildungsplanDto_base {
}
export {};
