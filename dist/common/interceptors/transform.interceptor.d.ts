import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
export interface Paginated<T> {
    items: ReadonlyArray<T>;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
interface Envelope<T> {
    data: T;
    meta: Record<string, unknown>;
}
export declare class TransformInterceptor<T> implements NestInterceptor<T, Envelope<T> | Envelope<unknown>> {
    private readonly reflector;
    constructor(reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Envelope<T> | Envelope<unknown>>;
    private isPaginated;
}
export {};
