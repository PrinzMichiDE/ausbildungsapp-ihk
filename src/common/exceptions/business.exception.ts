import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  public readonly errorCode: string;

  constructor(
    errorCode: string,
    message: string,
    status: HttpStatus,
    public readonly details?: unknown,
  ) {
    super({ errorCode, message, details }, status);
    this.errorCode = errorCode;
  }
}
