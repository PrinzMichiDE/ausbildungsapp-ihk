import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RAW_RESPONSE_KEY } from '../decorators/raw-response.decorator.js';

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

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Envelope<T> | Envelope<unknown>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Envelope<T> | Envelope<unknown>> {
    const isRaw = this.reflector.getAllAndOverride<boolean>(RAW_RESPONSE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isRaw) {
      return next.handle() as unknown as Observable<
        Envelope<T> | Envelope<unknown>
      >;
    }

    return next.handle().pipe(
      map((result) => {
        const meta = { timestamp: new Date().toISOString() };

        if (this.isPaginated(result)) {
          return {
            data: result.items,
            meta: { ...meta, ...result.meta },
          };
        }

        return { data: result, meta };
      }),
    );
  }

  private isPaginated(result: unknown): result is Paginated<unknown> {
    return (
      typeof result === 'object' &&
      result !== null &&
      'items' in result &&
      'meta' in result &&
      Array.isArray((result as Paginated<unknown>).items)
    );
  }
}
