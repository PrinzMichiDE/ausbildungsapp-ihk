var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
import { Catch, HttpException, HttpStatus, Logger, } from '@nestjs/common';
import { ERROR_CODES } from '../constants/error-codes.js';
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { status, error, message, details } = this.resolve(exception);
        if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`${request.method} ${request.url} -> ${status} ${error}: ${message}`, {
                correlationId: request.correlationId,
                exception: exception instanceof Error ? exception.stack : String(exception),
            });
        }
        else {
            this.logger.warn(`${request.method} ${request.url} -> ${status} ${error}: ${message}`, { correlationId: request.correlationId });
        }
        const body = {
            statusCode: status,
            error,
            message,
            details,
            path: request.url,
            timestamp: new Date().toISOString(),
            correlationId: request.correlationId ?? 'unknown',
        };
        response.status(status).json(body);
    }
    resolve(exception) {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            if (this.isValidationException(exception, response)) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    error: ERROR_CODES.VALIDATION_FAILED,
                    message: 'Validierung fehlgeschlagen',
                    details: this.extractValidationDetails(response),
                };
            }
            const { message, errorCode, details } = this.parseResponse(response);
            return {
                status,
                error: errorCode ?? this.defaultError(status),
                message: message ?? exception.message,
                details,
            };
        }
        return {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: 'Interner Serverfehler',
        };
    }
    isValidationException(exception, response) {
        return (exception instanceof HttpException &&
            exception.getStatus() === HttpStatus.BAD_REQUEST &&
            typeof response === 'object' &&
            response !== null &&
            'message' in response &&
            Array.isArray(response.message));
    }
    extractValidationDetails(response) {
        const message = response.message;
        return message.map((entry) => ({ reason: String(entry) }));
    }
    parseResponse(response) {
        if (typeof response === 'string') {
            return { message: response };
        }
        if (typeof response === 'object' && response !== null) {
            const obj = response;
            return {
                message: obj.message,
                errorCode: obj.errorCode ?? obj.error,
                details: obj.details,
            };
        }
        return {};
    }
    defaultError(status) {
        switch (status) {
            case HttpStatus.NOT_FOUND:
                return ERROR_CODES.NOT_FOUND;
            case HttpStatus.FORBIDDEN:
                return ERROR_CODES.ACCESS_DENIED;
            case HttpStatus.UNAUTHORIZED:
                return ERROR_CODES.UNAUTHENTICATED;
            case HttpStatus.CONFLICT:
                return ERROR_CODES.CONFLICT;
            default:
                return ERROR_CODES.INTERNAL_SERVER_ERROR;
        }
    }
};
AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    Catch()
], AllExceptionsFilter);
export { AllExceptionsFilter };
//# sourceMappingURL=all-exceptions.filter.js.map