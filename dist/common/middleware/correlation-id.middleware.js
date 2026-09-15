var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CorrelationIdMiddleware_1;
import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
let CorrelationIdMiddleware = CorrelationIdMiddleware_1 = class CorrelationIdMiddleware {
    logger = new Logger(CorrelationIdMiddleware_1.name);
    use(request, _response, next) {
        const incoming = request.headers['x-correlation-id'];
        request.correlationId =
            (Array.isArray(incoming) ? incoming[0] : incoming) ?? randomUUID();
        next();
    }
};
CorrelationIdMiddleware = CorrelationIdMiddleware_1 = __decorate([
    Injectable()
], CorrelationIdMiddleware);
export { CorrelationIdMiddleware };
//# sourceMappingURL=correlation-id.middleware.js.map