import { HttpException, HttpStatus } from '@nestjs/common';
export declare class BusinessException extends HttpException {
    readonly details?: unknown | undefined;
    readonly errorCode: string;
    constructor(errorCode: string, message: string, status: HttpStatus, details?: unknown | undefined);
}
