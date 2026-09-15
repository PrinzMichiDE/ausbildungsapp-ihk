import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ERROR_CODES } from '../constants/error-codes.js';

interface ErrorBody {
  statusCode: number;
  error: string;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
  correlationId: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { correlationId?: string }>();

    const { status, error, message, details } = this.resolve(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status} ${error}: ${message}`,
        {
          correlationId: request.correlationId,
          exception:
            exception instanceof Error ? exception.stack : String(exception),
        },
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} -> ${status} ${error}: ${message}`,
        { correlationId: request.correlationId },
      );
    }

    const body: ErrorBody = {
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

  private resolve(exception: unknown): {
    status: number;
    error: string;
    message: string;
    details?: unknown;
  } {
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

  private isValidationException(
    exception: HttpException,
    response: unknown,
  ): boolean {
    return (
      exception instanceof HttpException &&
      exception.getStatus() === HttpStatus.BAD_REQUEST &&
      typeof response === 'object' &&
      response !== null &&
      'message' in response &&
      Array.isArray((response as { message: unknown }).message)
    );
  }

  private extractValidationDetails(response: unknown): unknown {
    const message = (response as { message: unknown[] }).message;
    return message.map((entry) => ({ reason: String(entry) }));
  }

  private parseResponse(response: unknown): {
    message?: string;
    errorCode?: string;
    details?: unknown;
  } {
    if (typeof response === 'string') {
      return { message: response };
    }
    if (typeof response === 'object' && response !== null) {
      const obj = response as {
        message?: string;
        errorCode?: string;
        error?: string;
        details?: unknown;
      };
      return {
        message: obj.message,
        errorCode: obj.errorCode ?? obj.error,
        details: obj.details,
      };
    }
    return {};
  }

  private defaultError(status: number): string {
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
}
