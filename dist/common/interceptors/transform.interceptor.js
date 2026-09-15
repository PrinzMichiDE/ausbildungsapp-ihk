var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { RAW_RESPONSE_KEY } from '../decorators/raw-response.decorator.js';
let TransformInterceptor = class TransformInterceptor {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const isRaw = this.reflector.getAllAndOverride(RAW_RESPONSE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isRaw) {
            return next.handle();
        }
        return next.handle().pipe(map((result) => {
            const meta = { timestamp: new Date().toISOString() };
            if (this.isPaginated(result)) {
                return {
                    data: result.items,
                    meta: { ...meta, ...result.meta },
                };
            }
            return { data: result, meta };
        }));
    }
    isPaginated(result) {
        return (typeof result === 'object' &&
            result !== null &&
            'items' in result &&
            'meta' in result &&
            Array.isArray(result.items));
    }
};
TransformInterceptor = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Reflector])
], TransformInterceptor);
export { TransformInterceptor };
//# sourceMappingURL=transform.interceptor.js.map