import { randomUUID } from 'node:crypto';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);

  use(request: Request & { correlationId?: string }, _response: Response, next: NextFunction): void {
    const incoming = request.headers['x-correlation-id'];
    request.correlationId =
      (Array.isArray(incoming) ? incoming[0] : incoming) ?? randomUUID();
    next();
  }
}
