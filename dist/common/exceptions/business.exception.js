import { HttpException } from '@nestjs/common';
export class BusinessException extends HttpException {
    details;
    errorCode;
    constructor(errorCode, message, status, details) {
        super({ errorCode, message, details }, status);
        this.details = details;
        this.errorCode = errorCode;
    }
}
//# sourceMappingURL=business.exception.js.map