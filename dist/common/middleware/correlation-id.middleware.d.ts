import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
export declare class CorrelationIdMiddleware implements NestMiddleware {
    private readonly logger;
    use(request: Request & {
        correlationId?: string;
    }, _response: Response, next: NextFunction): void;
}
