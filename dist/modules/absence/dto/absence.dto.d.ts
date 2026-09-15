import { AbwesenheitTyp, AbwesenheitQuelle } from '@prisma/client';
export declare class CreateAbwesenheitDto {
    azubiId?: string;
    typ: AbwesenheitTyp;
    quelle?: AbwesenheitQuelle;
    von: string;
    bis: string;
    notiz?: string;
}
export declare class UpdateAbwesenheitDto {
    typ?: AbwesenheitTyp;
    von?: string;
    bis?: string;
    notiz?: string;
}
export declare class AbwesenheitResponseDto {
    id: string;
    azubiId: string;
    typ: AbwesenheitTyp;
    quelle: AbwesenheitQuelle;
    von: Date;
    bis: Date;
    notiz: string | null;
}
